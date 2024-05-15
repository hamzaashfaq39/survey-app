import React, { useState } from 'react';
import moment from 'moment'; // Importing moment.js library for date formatting
import { Table, Modal, Button, Empty } from 'antd'; // Importing necessary components from Ant Design
import { EyeOutlined } from '@ant-design/icons'; // Importing EyeOutlined icon from Ant Design icons
import { useSelector } from 'react-redux'; // Importing useSelector hook from React Redux

const HistoryScreen = () => {
  const surveys = useSelector((state) => state.survey.response); // Fetching survey responses from Redux store
  const [viewModalVisible, setViewModalVisible] = useState(false); // State for controlling visibility of view modal
  const [selectedSurvey, setSelectedSurvey] = useState(null); // State for storing selected survey

  // Columns configuration for the main survey history table
  const columns = [
    {
      title: 'Survey Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Date',
      dataIndex: 'dateTime',
      key: 'dateTime',
      render: (dateTime) => moment(dateTime).format('YYYY MMMM DD'), // Formatting date using moment.js
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" onClick={() => openViewModal(record)}>
          <EyeOutlined />
          View Responses
        </Button>
      ),
    },
  ];

  // Function to open view modal and set the selected survey
  const openViewModal = (survey) => {
    setSelectedSurvey(survey);
    setViewModalVisible(true);
  };

  // Function to close view modal and reset selected survey
  const closeViewModal = () => {
    setViewModalVisible(false);
    setSelectedSurvey(null);
  };

  // Columns configuration for the modal table displaying survey responses
  const urlHistoryColumns = [
    { title: 'Question', dataIndex: 'question', key: 'question' },
    { title: 'Answer', dataIndex: 'answer', key: 'answer' },
  ];

  return (
    <div>
      <h1>History</h1>
      {/* Rendering main survey history table */}
      {surveys.length > 0 ? (
        <Table
          columns={columns}
          dataSource={surveys}
          rowKey={(record, index) => index}
        />
      ) : (
        <Empty description="No surveys available" />
      )}

      {/* Modal for displaying survey responses */}
      <Modal
        title="Survey Responses"
        visible={viewModalVisible}
        onCancel={closeViewModal}
        footer={null}
        width={800}
      >
        {/* Rendering table inside the modal to display survey responses */}
        <Table
          dataSource={selectedSurvey ? selectedSurvey.responses : []}
          columns={urlHistoryColumns}
          rowKey={(record, index) => index}
        />
      </Modal>
    </div>
  );
};

export default HistoryScreen;
