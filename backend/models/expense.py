from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ExpenseRow(BaseModel):
    """Single row in the expense spreadsheet"""
    id: int
    date: str = ""
    receiver: str = ""
    purpose: str = ""
    deposit: str = ""
    transport: str = ""
    food: str = ""
    medication: str = ""
    house: str = ""
    car: str = ""
    school: str = ""
    diverse: str = ""

class MonthExpenses(BaseModel):
    """Complete month's expense data"""
    month: str
    year: int
    rows: List[ExpenseRow]
    updated_at: Optional[datetime] = None

class MonthExpensesCreate(BaseModel):
    """Data for creating/updating month expenses"""
    month: str
    year: int
    rows: List[ExpenseRow]

class MonthExpensesResponse(BaseModel):
    """Response when fetching month expenses"""
    month: str
    year: int
    rows: List[ExpenseRow]
    updated_at: Optional[datetime] = None