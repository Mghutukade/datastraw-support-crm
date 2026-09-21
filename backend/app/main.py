from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from . import database, models, schemas, crud

# Automatically create database tables on startup if they don't exist
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Customer Support Ticketing CRM API",
    description="Backend API for Datastraw AI + Tech Intern Assessment",
    version="1.0.0"
)

# Enable CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Datastraw Support CRM API is running successfully!"}

# 1. Create a ticket
@app.post("/api/tickets", response_model=schemas.TicketResponse, status_code=201)
def create_ticket(ticket: schemas.TicketCreate, db: Session = Depends(database.get_db)):
    return crud.create_ticket(db=db, ticket=ticket)

# 2. List tickets (supports optional search and status filtering)
@app.get("/api/tickets", response_model=List[schemas.TicketResponse])
def list_tickets(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None, description="Search by customer name, email, or subject"),
    status: Optional[str] = Query(None, description="Filter by status (Open, In Progress, Resolved, Closed)"),
    db: Session = Depends(database.get_db)
):
    tickets = crud.get_tickets(db, skip=skip, limit=limit, search=search, status=status)
    return tickets

# 3. Get single ticket details
@app.get("/api/tickets/{ticket_id}", response_model=schemas.TicketResponse)
def get_ticket(ticket_id: int, db: Session = Depends(database.get_db)):
    db_ticket = crud.get_ticket(db, ticket_id=ticket_id)
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return db_ticket

# 4. Update ticket status, priority, and add internal notes
@app.put("/api/tickets/{ticket_id}", response_model=schemas.TicketResponse)
def update_ticket(
    ticket_id: int,
    ticket_update: schemas.TicketUpdate,
    db: Session = Depends(database.get_db)
):
    db_ticket = crud.update_ticket(db, ticket_id=ticket_id, ticket_update=ticket_update)
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return db_ticket