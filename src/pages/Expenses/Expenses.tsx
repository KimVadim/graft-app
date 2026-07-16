import { Col, Row, Spin, Table, Tag, Input, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { getExpenseData } from "../../service/appServiceBackend";
import { FieldPlaceholder, ModalTitle } from "../../constants/appConstant";
import { AddFloatButton } from "../../components/AddFloatButton";
import { AddExpenseModal } from "./AddExpenseModal";
import { MenuComp } from "../../components/Menu";
import { setExpense } from "../../slices/expenseSlice";
import { ExpenseFieldData, expenseMeta, ExpenseType } from "./ExpensesMeta";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ru";
import locale from "antd/es/date-picker/locale/ru_RU";


export const Expenses: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [loading, setLoading] = useState<boolean>(false);
  const expenseData = useSelector((state: RootState) => state.expense.expense) as unknown as ExpenseType[];
  const [isAddExpense, setIsAddExpense] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getExpenseData(
        selectedDate.year(),
        selectedDate.month() + 1,
      );
      dispatch(setExpense(response?.expense));
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

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
          <Col style={{ maxWidth: "70px" }}>
            <strong>{ModalTitle.Expenses}</strong>
          </Col>
          <Col>
            <Input
              placeholder={FieldPlaceholder.SearchApartNum}
              value={searchText}
              onChange={actions.handleSearch}
              style={{ width: 95 }}
            />
          </Col>
          <Col>
            <DatePicker.MonthPicker
              value={selectedDate}
              onChange={(date) => date && setSelectedDate(date)}
              allowClear={false}
              format="MMM YY"
              style={{ width: 100 }}
              locale={locale}
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
                <Tag color="#066d1e">{record?.[ExpenseFieldData.ExpenseName]}</Tag>
                <p>{record?.[ExpenseFieldData.Comment]}</p>
              </p>
            ),
            //rowExpandable: (record) => !!record?.[ExpenseFieldData.Comment],
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