import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd'

import { layout, validateMessages } from './configs'
import { getReservationByPhone } from '../../helpers/services/register'
import styles from './styles.module.scss'

const Check = () => {
  const [info, setInfo] = useState(null)
  const [isFail, setFail] = useState(false)

  const onCheck = values => {
    getReservationByPhone(values.phone).then(data => {
      setInfo(data)
      setFail(false)
    }).catch(() => {
      setInfo(null)
      setFail(true)
    })
  };

  return (
    <>
      <Form {...layout} name="nest-messages" onFinish={onCheck} validateMessages={validateMessages}>
        <Form.Item name={['phone']} label="Phone number">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Check
          </Button>
        </Form.Item>
      </Form>
      {isFail ? <div className={styles.fail}>Information not found, please register for vaccination</div> : null}
      {info ? <>
        <Card title="Reservation Information" style={{ width: 600 }}>
          <p>Name: <strong>{info?.customer?.name || 'N/a'}</strong></p>
          <p>Verified: <strong>{`${info.isVerify ? 'Yes': 'Not yet'}`}</strong></p>
          <p>Centre: <strong>{info?.centre?.title || 'N/a'}</strong></p>
          <p>Branch: <strong>{info?.branch?.title || 'N/a'}</strong></p>
          <p>Address: <strong>{info?.branch?.address || 'N/a'}</strong></p>
          <p>Estimated time of service: <strong>{new Date(info?.serveDay).toDateString()}</strong></p>
        </Card>
      </> : null}
    </>
  )
}

export default Check