from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr

# --- Note Schemas ---
class NoteCreate(BaseModel):
    author: Optional[str] = "Support Agent"
    content: str

class NoteResponse(BaseModel):
    id: int
    ticket_id: int
    author: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Ticket Schemas ---
class TicketCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    subject: str
    description: str
    priority: Optional[str] = "Medium"

class TicketUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    note: Optional[str] = None  # Allows adding an internal note during updates

class TicketResponse(BaseModel):
    id: int
    ticket_uuid: str
    customer_name: str
    customer_email: str
    subject: str
    description: str
    status: str
    priority: str
    created_at: datetime
    updated_at: datetime
    notes: List[NoteResponse] = []

    class Config:
        from_attributes = True