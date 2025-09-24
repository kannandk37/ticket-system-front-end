import { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TablePagination,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { TicketPriority, TicketStatus, type Ticket } from "../entity";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const statusOptions = [
  { value: "", label: "All Status" },
  { value: TicketStatus.OPEN, label: "Open" },
  { value: TicketStatus.IN_PROGRESS, label: "In Progress" },
  { value: TicketStatus.CLOSED, label: "Closed" },
];

const priorityOptions = [
  { value: "", label: "All Priority" },
  { value: TicketPriority.LOW, label: "Low" },
  { value: TicketPriority.MEDIUM, label: "Medium" },
  { value: TicketPriority.HIGH, label: "High" },
];

function Tickets({ pageSize = 10 }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [from, setFrom] = useState<DateTime>(null);
  const [to, setTo] = useState<DateTime>(null);
  const [cursor, setCursor] = useState<string>(null);

  useEffect(() => {
    (async () => {
      await getTickets();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await getTickets();
    })();
  }, [rowsPerPage, page]);

  const getTickets = async () => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/tickets`;

      const params = new URLSearchParams();
      if (search?.trim()) {
        params.set("search", search?.trim());
      }
      if (selectedStatus) {
        params.set("status", selectedStatus);
      }
      if (selectedPriority) {
        params.set("priority", selectedPriority);
      }
      if (from) {
        params.set("from", from.toString());
      }
      if (to) {
        params.set("to", to.toString());
      }
      console.log(cursor, page);
      if (cursor && page > 0) {
        params.set("cursor", cursor.toString());
      }
      params.set("page", String(page));
      params.set("limit", String(rowsPerPage));

      let ticketsData = await axios.get(`${url}?${params.toString()}`);
      setTickets(ticketsData?.data?.data as any);
      if (ticketsData?.data?.data?.length > 0) {
        setCursor(
          ticketsData?.data?.data[ticketsData?.data?.data.length - 1].id
        );
      } else {
        setCursor(null);
      }
      setTotal(ticketsData?.data?.total);
      nullifyRangeFilter();
    } catch (error) {
      console.log(error);
    }
  };

  const nullifyRangeFilter = () => {
    setFrom(null);
    setTo(null);
  };

  const deleteTicket = async (id: string) => {
    try {
      let ticketsData = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/tickets/${id}`
      );
      await getTickets();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e?.target?.value) {
      setSearch(e.target.value?.trim());
    } else {
      setSearch(null);
    }
  };

  const handleChangeRowsPerPage = async (e: any) => {
    setRowsPerPage(e?.target?.value);
  };

  const handleChangePage = async (e: any, value: any) => {
    setPage(value);
  };

  function TableHeader() {
    return (
      <TableHead>
        <TableRow>
          <TableCell key="S.No" sx={{ width: "80px" }}>
            <h3>S.No</h3>
          </TableCell>
          <TableCell key="Query">
            <h3>Query</h3>
          </TableCell>
          <TableCell key="Answer">
            <h3>Answer</h3>
          </TableCell>
          <TableCell key="Status">
            <h3>Status</h3>
          </TableCell>
          <TableCell key="Priority">
            <h3>Priority</h3>
          </TableCell>
          <TableCell key="CreadedOn">
            <h3>Created On</h3>
          </TableCell>
          <TableCell key="Action">
            <h3>Action</h3>
          </TableCell>
        </TableRow>
      </TableHead>
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <Button color="info" onClick={() => navigate("/welcome")}>
          &#8592; Back
        </Button>
        <h2>Tickets</h2>
      </div>
      <div
        style={{
          width: "100%",
          margin: "20px 5px 15px 5px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <div>
            <TextField
              id="outlined-basic"
              value={search}
              variant="outlined"
              placeholder="Search"
              onChange={(e) => {
                handleSearch(e);
              }}
              sx={{ width: 300 }}
            />
          </div>
          <div>
            <Autocomplete
              options={statusOptions}
              value={
                statusOptions.find((el) => el.value == selectedStatus) ?? null
              }
              onChange={(e, v) => {
                if (v?.value) {
                  setSelectedStatus(v.value);
                } else {
                  setSelectedStatus(statusOptions[0].value);
                }
              }}
              renderInput={(params) => (
                <TextField {...(params as any)} label="Status" size="medium" />
              )}
              sx={{ width: 300 }}
            />
          </div>
          <div>
            <Autocomplete
              options={priorityOptions}
              value={
                priorityOptions.find((el) => el.value == selectedPriority) ??
                null
              }
              onChange={(e, v) => {
                if (v?.value) {
                  setSelectedPriority(v.value);
                } else {
                  setSelectedPriority(priorityOptions[0].value);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...(params as any)}
                  label="Priority"
                  size="medium"
                />
              )}
              sx={{ width: 300 }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <h3>From:</h3>
            <DatePicker
              value={from}
              onChange={(newValue) => setFrom(newValue)}
              maxDate={DateTime.now()}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <h3>To:</h3>
            <DatePicker
              value={to}
              onChange={(newValue) => setTo(newValue)}
              maxDate={DateTime.now()}
            />
          </div>
          <div>
            <Button
              variant="outlined"
              sx={{ width: 300, height: 55 }}
              onClick={getTickets}
            >
              Apply
            </Button>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Button
              variant="outlined"
              sx={{ width: 300, height: 55 }}
              onClick={() =>
                navigate(`/ticket`, {
                  state: { isEditing: false, isAdding: true },
                })
              }
            >
              Add
            </Button>
          </div>
        </div>
        <div>
          <Paper>
            <TableContainer>
              <Table>
                <TableHeader />
                <TableBody>
                  {tickets?.length > 0 &&
                    tickets?.map((el: Ticket, index: number) => {
                      return (
                        <>
                          <TableRow>
                            <TableCell>
                              {/* <h4>{page * rowsPerPage + index + 1}</h4> */}
                              <h4>{el.id}</h4>
                            </TableCell>
                            <TableCell>
                              <h4>{el.title}</h4>
                            </TableCell>
                            <TableCell>
                              <h4>{el.description}</h4>
                            </TableCell>
                            <TableCell>
                              <h4>{el.status}</h4>
                            </TableCell>
                            <TableCell>
                              <h4>{el.priority}</h4>
                            </TableCell>
                            <TableCell>
                              <h4>
                                {DateTime.fromJSDate(
                                  new Date(el.createdAt.toString())
                                ).toFormat("yyyy LLL dd")}
                              </h4>
                            </TableCell>
                            <TableCell>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: "10px",
                                }}
                              >
                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    if (el.id) {
                                      navigate(`/ticket/${el.id}`, {
                                        state: { isEditing: false },
                                      });
                                    }
                                  }}
                                >
                                  View
                                </Button>
                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    if (el.id) {
                                      navigate(`/ticket/${el.id}`, {
                                        state: { isEditing: true },
                                      });
                                    }
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outlined"
                                  onClick={async () => {
                                    if (el.id) {
                                      await deleteTicket(el.id);
                                    }
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
        <div>
          <TablePagination
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </>
  );
}

export default Tickets;
