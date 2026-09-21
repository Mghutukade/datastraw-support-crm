import uuid
from sqlalchemy.orm import Session
from . import models, schemas

def get_ticket(db: Session, ticket_id: int):
    return db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()

def get_tickets(db: Session, skip: int = 0, limit: int = 100, search: str = None, status: str = None):
    query = db.query(models.Ticket)
    
    # Filter by status if provided (and not "All")
    if status and status != "All":
        query = query.filter(models.Ticket.status == status)
        
    # Search by customer name, subject, or email if provided
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (models.Ticket.customer_name.ilike(search_filter)) |
            (models.Ticket.subject.ilike(search_filter)) |
            (models.Ticket.customer_email.ilike(search_filter))
        )
        
    return query.offset(skip).limit(limit).all()

def create_ticket(db: Session, ticket: schemas.TicketCreate):
    # Generate a professional short unique identifier like TKT-49F2
    unique_ref = f"TKT-{uuid.uuid4().hex[:6].upper()}"
    
    db_ticket = models.Ticket(
        ticket_uuid=unique_ref,
        customer_name=ticket.customer_name,
        customer_email=ticket.customer_email,
        subject=ticket.subject,
        description=ticket.description,
        priority=ticket.priority,
        status="Open"
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def update_ticket(db: Session, ticket_id: int, ticket_update: schemas.TicketUpdate):
    db_ticket = get_ticket(db, ticket_id)
    if not db_ticket:
        return None
        
    if ticket_update.status:
        db_ticket.status = ticket_update.status
    if ticket_update.priority:
        db_ticket.priority = ticket_update.priority
        
    # If a new internal note/comment was provided, save it to the notes table!
    if ticket_update.note:
        db_note = models.Note(
            ticket_id=db_ticket.id,
            author="Support Agent",
            content=ticket_update.note
        )
        db.add(db_note)
        
    db.commit()
    db.refresh(db_ticket)
    return db_ticket