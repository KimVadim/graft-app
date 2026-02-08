import { Col, Row, Spin, Table, Input } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { RootState } from "../store.ts";
import { useSelector } from "react-redux";
import { contactMeta } from "./AllApplicationMeta.tsx";
import { ContactFieldData, ContactType, FieldPlaceholder, ModalTitle } from "../constants/appConstant.ts";
import { AddFloatButton } from "../components/AddFloatButton.tsx";
import { AddContactModal } from "../components/AddContactModal.tsx";
import { MenuComp } from "../components/Menu.tsx";

export const Contacts: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const contactAllData = useSelector((state: RootState) => state.contact.contact) as unknown as ContactType[];
  const [isAddContact, setIsAddContact] = useState(false);
  const contactData = useMemo(() => {
    return contactAllData
      .filter((x) => x[ContactFieldData.Type] !== "Renter")
      .sort((a, b) =>
        a[ContactFieldData.Type].localeCompare(b[ContactFieldData.Type])
      );
  }, [contactAllData]);

  useEffect(() => {
    if (searchText) {
      const filtered = contactData.filter((item) =>
        item[ContactFieldData.FirstName]?.toLowerCase().includes(searchText.toLowerCase()) ||
        item[ContactFieldData.Type]?.toLowerCase().includes(searchText.toLowerCase()) ||
        item[ContactFieldData.Phone]?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(contactData);
    }
  }, [searchText, contactData]);

  const actions = {
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
  };

  return (
    <div style={{ padding: 5, display: 'flex', justifyContent: 'center'}}>
      <Spin spinning={loading}>
        <Row align="middle" gutter={15} style={{ marginBottom: 16 }}>
          <Col flex="auto" style={{ maxWidth: "111px" }}>
            <MenuComp/>
          </Col>
          <Col>
            <strong>{ModalTitle.Contacts}</strong>
          </Col>
          <Col>
            <Input
              placeholder={FieldPlaceholder.EnterContactData}
              value={searchText}
              onChange={actions.handleSearch}
              style={{ width: 170 }}
            />
          </Col>
        </Row>
        <Table
          rowKey="ID"
          scroll={{ x: 395 }}
          columns={contactMeta}
          dataSource={filteredData}
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>
                {record?.[ContactFieldData.Description]}
              </p>
            ),
            rowExpandable: (record) => !!record?.[ContactFieldData.Description],
          }}
          size="middle"
          pagination={{
            position: ["bottomCenter"],
            pageSize: 100,
          }}
        />
        <AddFloatButton
          setIsAddContact={setIsAddContact}
        />
        {isAddContact && <AddContactModal
          setIsAddContact={setIsAddContact} isAddContact={isAddContact} setLoading={setLoading} loading={loading}
        />}
      </Spin>
    </div>
  );
};