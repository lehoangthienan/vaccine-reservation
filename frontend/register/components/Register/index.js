import React from 'react';
import { Form, Input, Button, message } from 'antd'

import { layout, validateMessages, key } from './configs'
import { createReservation } from '../../helpers/services/register'

const Check = () => {
  const [form] = Form.useForm();

  const onFinish = values => {
    createReservation(values).then(data => {
      message.loading({ content: 'Loading...', key });
      setTimeout(() => {
        message.success({ content: 'Success!', key, duration: 2 });
        form.resetFields();
      }, 1000);
    }).catch((err) => {
      console.log('err', err)
      message.error({ content: 'An error occurred', key })
    })
  };

  return (
    <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages} form={form}>
      <Form.Item name={['fullname']} label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={['phone']} label="Phone" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={['address']} label="Address" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={['idf']} label="ID" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Check