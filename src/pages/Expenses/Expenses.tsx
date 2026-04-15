import { Col, Row, Spin, Table, Tag, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { getExpenseData } from "../../service/appServiceBackend";
import { FieldPlaceholder, ModalTitle, OrderType } from "../../constants/appConstant";
import { AddFloatButton } from "../../components/AddFloatButton";
import { AddExpenseModal } from "./AddExpenseModal";
import { MenuComp } from "../../components/Menu";
import { setExpense } from "../../slices/expenseSlice";
import { ExpenseFieldData, expenseMeta, ExpenseType } from "./ExpensesMeta";

export const Expenses: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const expenseData = useSelector((state: RootState) => state.expense.expense) as unknown as ExpenseType[];
  const optyData = useSelector((state: RootState) => state.order.order) as unknown as OrderType[];
  const [isAddExpense, setIsAddExpense] = useState(false);
  const isCalledRef = useRef(false);
  const dateRef = useRef(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const expense = await getExpenseData(
          dateRef.current.getFullYear(),
          dateRef.current.getMonth() + 1,
        );
        dispatch(setExpense(expense));
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
  }, [dispatch, optyData]);
  useEffect(() => {
    if (searchText) {
      const filtered = expenseData.filter((item: ExpenseType) =>
        item[ExpenseFieldData.ExpenseName]?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
        item[ExpenseFieldData.Comment]?.toString().toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(expenseData);
    }
  }, [searchText, expenseData]);

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
          columns={expenseMeta}
          dataSource={filteredData}
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>
                <Tag color="#270d9a">{record?.[ExpenseFieldData.ExpenseName]}</Tag>
                <p>{record?.[ExpenseFieldData.Comment]}</p>
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
          setIsAddExpense={setIsAddExpense}
        />
        {isAddExpense && <AddExpenseModal
          setIsAddExpense={setIsAddExpense} isAddExpense={isAddExpense}
        />}
      </Spin>
    </div>
  );
};