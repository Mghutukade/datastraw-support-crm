from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from .database import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    ticket_uuid = Column(String, unique=True, index=True)
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, default="Open")  # Open, In Progress, Resolved, Closed
    priority = Column(String, default="Medium")  # Low, Medium, High
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # One-to-Many relationship: One ticket can have multiple notes/updates
    notes = relationship("Note", back_populates="ticket", cascade="all, delete-orphan")


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id", ondelete="CASCADE"))
    author = Column(String, default="Support Agent")
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship back to ticket
    ticket = relationship("Ticket", back_populates="notes")