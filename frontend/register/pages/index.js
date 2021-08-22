import React from 'react';
import { Tabs } from 'antd'

import Check from '../components/Check'
import Register from '../components/Register'
import styles from '../styles/home.module.scss'

const { TabPane } = Tabs;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

const Home = () => {
  const onFinish = (values) => {
    console.log(values);
  };
  return (
    <div className={styles.home}>
      <Tabs defaultActiveKey="1" centered animated>
        <TabPane tab="Register" key="register">
          <Register />
        </TabPane>
        <TabPane tab="Check" key="check">
          <Check />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Home