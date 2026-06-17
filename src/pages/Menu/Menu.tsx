import { Col, Row, Spin, Table, Tag, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { getMenuData } from "../../service/appServiceBackend";
import { FieldPlaceholder, ModalTitle } from "../../constants/appConstant";
import { AddFloatButton } from "../../components/AddFloatButton";
import { MenuComp } from "../../components/Menu";
import { MenuFieldData, menuMeta, MenuType, } from "./MenuMeta";
import { setMenu } from "../../slices/menuSlice";
import { AddMenuModal } from "./AddMenuModal";

export const Menu: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const menuData = useSelector((state: RootState) => state.menu.menu) as unknown as MenuType[];
  const [isAddMenu, setIsAddMenu] = useState(false);
  const isCalledRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        getMenuData().then((response) => {
          dispatch(setMenu(response?.menu));
        });
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };
    if (!isCalledRef.current) {
      fetchData();
      isCalledRef.current = true;
    }
  }, [dispatch, menuData]);
  useEffect(() => {
    if (searchText) {
      const filtered = menuData.filter((item: MenuType) =>
        item[MenuFieldData.MenuName]?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
        item[MenuFieldData.Comment]?.toString().toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(menuData);
    }
  }, [searchText, menuData]);

  const actions = {
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
  };

  return (
    <div style={{ padding: 5, display: 'flex', justifyContent: 'center'}}>
      <Spin spinning={loading}>
        <Row align="middle" gutter={15} style={{ marginBottom: 16 }}>
          <Col flex="auto" style={{ maxWidth: "115px" }}>
            <MenuComp/>
          </Col>
          <Col>
            <strong>{ModalTitle.Expenses}</strong>
          </Col>
          <Col>
            <Input
              placeholder={FieldPlaceholder.SearchApartNum}
              value={searchText}
              onChange={actions.handleSearch}
              style={{ width: 170 }}
            />
          </Col>
        </Row>
        <Table
          rowKey="id"
          scroll={{ x: 395 }}
          columns={menuMeta}
          dataSource={filteredData}
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>
                <Tag color="#270d9a">Себес. - {record?.[MenuFieldData.Price]}</Tag>
                <Tag color="#5533e9">Колл. - {record?.[MenuFieldData.Count]}</Tag>
                <p>{record?.[MenuFieldData.Comment]}</p>
              </p>
            ),
          }}
          size="middle"
          pagination={{
            position: ["bottomCenter"],
            pageSize: 20,
          }}
        />
        <AddFloatButton
          setIsAddMenu={setIsAddMenu}
        />
        {isAddMenu && <AddMenuModal
          setIsAddMenu={setIsAddMenu} isAddMenu={isAddMenu}
        />}
      </Spin>
    </div>
  );
};