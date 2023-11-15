import React from "react";
import AppLayout from "../../layout/AppLayout";
import { Button, Input, Table, Tag, Space } from "antd";

import { SearchOutlined } from '@ant-design/icons';

const Devices: React.FC = () => {

    const handleSearch = (selectedKeys: React.Key[], confirm: () => void, dataIndex: string) => {
      confirm();
    };

    const handleReset = (clearFilters: () => void) => {
      clearFilters();
    };

    const getColumnSearchProps = (dataIndex: string) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            //   icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value: any, record: any) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    });

    const dataSource = [
        { key: '1', name: 'John Doe', age: 25, address: '123 Main St',tags: ['nice', 'developer'], },
        { key: '2', name: 'Jane Doe', age: 30, address: '456 Oak St',tags: ['nice', 'developer'], },
        { key: '3', name: 'John Doe', age: 25, address: '123 Main St' ,tags: ['nice', 'developer'],},
        { key: '4', name: 'Jane Doe', age: 30, address: '456 Oak St' ,tags: ['nice', 'developer'],},
        { key: '5', name: 'John Doe', age: 25, address: '123 Main St',tags: ['nice', 'developer'], },
        { key: '6', name: 'Jane Doe', age: 30, address: '456 Oak St' ,tags: ['nice', 'developer'],},
        { key: '7', name: 'John Doe', age: 25, address: '123 Main St',tags: ['nice', 'developer'], },
        { key: '8', name: 'Jane Doe', age: 30, address: '456 Oak St' ,tags: ['nice', 'developer'],},

        // Add more data as needed
    ];

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name', ...getColumnSearchProps('name') },
        { title: 'Age', dataIndex: 'age', key: 'age', ...getColumnSearchProps('age') },
        { title: 'Address', dataIndex: 'address', key: 'address', ...getColumnSearchProps('address') },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (_: any, { tags }: { tags: string[] }) => (
              <>
                {tags.map((tag) => {
                  let color = tag.length > 5 ? 'geekblue' : 'green';
                  if (tag === 'loser') {
                    color = 'volcano';
                  }
                  return (
                    <Tag color={color} key={tag}>
                      {tag.toUpperCase()}
                    </Tag>
                  );
                })}
              </>
            ),
          },
        // Add more columns as needed
      ];

    const paginationConfig = {
        pageSize: 5, // Display 5 items per page
      };
  return (
    <AppLayout>
        <div className="section-break">
      <h1>Devices</h1>
      <Table dataSource={dataSource} columns={columns} pagination={paginationConfig} />
      </div>
    </AppLayout>
  );
};

export default Devices;
