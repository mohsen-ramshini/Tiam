/* eslint-disable prettier/prettier */
// src/pages/CreateProbe.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card } from 'antd';
import ProbeForm from '../components/probeForm';

const CreateProbe = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // می‌توانید کاربر را به صفحه دیگری هدایت کنید یا همینجا بمانید
    // navigate('/dashboard');
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={10}>
        <ProbeForm onSuccess={handleSuccess} onClose={handleClose} />
      </Col>
    </Row>
  );
};

export default CreateProbe;