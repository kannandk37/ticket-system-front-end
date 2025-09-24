import { useState, useEffect } from "react";
import { TextField, Button, Autocomplete } from "@mui/material";
import { Ticket, TicketStatus, TicketPriority } from "../entity";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

let statusData = [
  TicketStatus.OPEN,
  TicketStatus.IN_PROGRESS,
  TicketStatus.CLOSED,
];

let priorityData = [
  TicketPriority.LOW,
  TicketPriority.MEDIUM,
  TicketPriority.HIGH,
];

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { isEditing, isAdding } = location.state;
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(null);
  const [selectedPriority, setSelectedPriority] =
    useState<TicketPriority>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [ticket, setTicket] = useState<Ticket>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        try {
          let response = await axios.get(
            `${process.env.BASE_URL}/api/tickets/${id}`
          );
          setTicket(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [id]);

  useEffect(() => {
    if (ticket) {
      setSelectedPriority(ticket.priority);
      setSelectedStatus(ticket.status);
      setQuestion(ticket.title);
      setAnswer(ticket.description);
    }
  }, [ticket]);

  const createOrEditTicket = async () => {
    try {
      if (ticket?.id) {
        let ticketData = ticket;
        if (answer) {
          ticketData.description = answer;
        }
        if (selectedPriority) {
          ticketData.priority = selectedPriority;
        }
        if (selectedStatus) {
          ticketData.status = selectedStatus;
        }
        await editTicket(ticketData);
      } else {
        if (!question) {
          console.log("log and throw error");
        } else {
          let ticket = new Ticket();
          ticket.title = question;
          await createTicket(ticket);
        }
      }
      navigate("/tickets");
    } catch (error) {
      console.log(error);
    }
  };

  const createTicket = async (ticket: Ticket) => {
    try {
      await axios.post(`${process.env.BASE_URL}/api/tickets`, ticket);
      navigate("/tickets");
    } catch (error) {
      console.log(error);
    }
  };

  const editTicket = async (ticket: Ticket) => {
    try {
      await axios.put(
        `${process.env.BASE_URL}/api/tickets/${ticket.id}`,
        ticket
      );
      navigate("/tickets");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <Button color="info" onClick={() => navigate("/tickets")}>
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
        <h1> Ticket</h1>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: "flex-start",
              paddingLeft: "30px",
            }}
          >
            <div>
              <h3> Question</h3>
              <TextField
                value={question ?? null}
                id="outlined-basic"
                variant="outlined"
                placeholder="Question"
                style={{
                  width: "800px",
                }}
                maxRows={2}
                disabled={!isAdding}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            {!isAdding && (
              <>
                <div>
                  <h3> Answer</h3>
                  <TextField
                    value={answer ?? null}
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="Answer"
                    style={{
                      width: "800px",
                    }}
                    minRows={4}
                    maxRows={5}
                    disabled={!isEditing}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>
                <div>
                  <h3> Status</h3>
                  <Autocomplete
                    options={statusData}
                    value={selectedStatus}
                    onChange={(e, value: any) => setSelectedStatus(value)}
                    renderInput={(params) => (
                      <TextField {...(params as any)} size="medium" />
                    )}
                    sx={{ width: 300 }}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <h3> Priority</h3>
                  <Autocomplete
                    options={priorityData}
                    value={selectedPriority}
                    onChange={(e, value: any) => setSelectedPriority(value)}
                    renderInput={(params) => (
                      <TextField {...(params as any)} size="medium" />
                    )}
                    sx={{ width: 300 }}
                    disabled={!isEditing}
                  />
                </div>
              </>
            )}
            {(isEditing || isAdding) && (
              <div style={{ paddingTop: "50px" }}>
                <Button
                  variant="outlined"
                  sx={{ width: 300, height: 55 }}
                  onClick={() => createOrEditTicket()}
                >
                  {isEditing ? "Update" : "Submit"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketDetail;
