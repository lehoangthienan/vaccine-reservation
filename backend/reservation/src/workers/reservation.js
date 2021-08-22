import mongoose, { Types } from 'mongoose'

import AMQP from './amqp'
import configs from '../configs'
import logger from '../utils/logger'
import { RABBIT_QUEUE } from '../utils/constants'
import { createCustomer, getNurseNIn } from '../services/user_profiler'
import Branch from '../models/branch'
import Reservation from '../models/reservation'

const MAX_DAYS_EXTEND = 9999

mongoose.connect(configs.MONGO_URL)
const db = mongoose.connection
db.on('open', () => {
  logger.info('DB connected')
})

db.on('error', (err) => logger.error(err))

AMQP.get_connection(configs.RABBIT_CONFIG).then((connection) => {
  AMQP.subscribe(connection, RABBIT_QUEUE, async (data, deliveryInfo, ack) => {
    try {
      logger.info('data Queue:', data);
      console.log('data', data)

      const customer = await createCustomer(data);

      const reservation = await Reservation.findOne({ customerID: new Types.ObjectId(customer._id) })
      if (reservation) {
        logger.error('Error: this customer registered');
        console.log('Error: this customer registered')
        ack.reject(false);
        return
      }

      let nurseAssign = null
      let branchAssign = null
      let serveDay = new Date()

      let session = null;
      for (let i = 0; i < MAX_DAYS_EXTEND; i ++) {
        const sessionTemp = await db.startSession();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + i);
        startDate.setUTCHours(0,0,0,0);
  
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + i);
        endDate.setUTCHours(23,59,59,999);

        const branches = await findBranches(startDate, endDate, sessionTemp)

        let isFindAssign = false

        for (let j = 0; j < branches.length; j ++) {
          const branch = branches[j]
          if (branch.capacity <= branch.count) continue
          isFindAssign = true
          branchAssign = branch
          serveDay = startDate
          nurseAssign = await findNurse(branch)
          break
        }
  
        if (!isFindAssign) {
          sessionTemp.endSession()
          continue
        } else {
          session = sessionTemp
          break
        }
      }

      const reservationData = {
        branch: branchAssign._id,
        centre: branchAssign.centre,
        nurseID: nurseAssign,
        customerID: customer._id,
        serveDay,
      }

      const newReservation = new Reservation(reservationData)
      await newReservation.save()
      if (session) session.endSession()

      // send notification or sms or websocket to nurse for is coming reservation
      // send notification or sms for user for get success reservation
      ///

      ack.acknowledge();
    } catch (ex) {
      logger.error('Error:', ex.message);
      console.log('ex', ex)
      ack.reject(false);
    }
  });
});

const findBranches = async (startDate, endDate, session) => {
  const objQueryMatch = {
    $match: {
      disabled: false,
    },
  }

  const objQueryProject = {
    $project: {
      count: {
        $size: '$reservations',
      },
      capacity: '$capacity',
      centre: '$centre',
    },
  }
  const objQueryLookup = {
    $lookup: {
      from: 'reservations',
      let: {
        branchID: '$_id',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$branch', '$$branchID'] },
                { $gte: ['$serveDay', new Date(startDate)] },
                { $lte: ['$serveDay', new Date(endDate)] },
              ],
            },
          },
        },
      ],
      as: 'reservations',
    },
  }

  const branches = await Branch.aggregate([
    objQueryMatch,
    objQueryLookup,
    objQueryProject,
    {
      $sort: {
        count: 1,
      },
    },
    // {
    //   $limit: 1,
    // },
  ]).session(session)
  return branches
}

const findNurse = async (branch) => {
  const objQueryMatchNurse = {
    $match: {
      branch: branch._id,
    },
  }
  const objGroup = {
    $group: {
      _id: "$nurseID",
      count: { $sum: 1 },
    } 
   }
   const reservations = await Reservation.aggregate([
    objQueryMatchNurse,
    objGroup,
    {
      $sort: {
        count: 1,
      },
    },
    {
      $limit: 1,
    },
  ])
  let nurseID = null
  if (reservations.length > 0) nurseID = reservations[0]._id

  const nurseIDs = reservations.map(reservation => reservation.nurseID)

  const nurses = await getNurseNIn(nurseIDs, branch._id)

  if (nurses && nurses.length > 0) nurseID = nurses[0]._id

  return nurseID
}