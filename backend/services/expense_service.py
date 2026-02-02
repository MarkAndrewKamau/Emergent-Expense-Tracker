from motor.motor_asyncio import AsyncIOMotorDatabase
from models.expense import MonthExpenses, MonthExpensesCreate, MonthExpensesResponse
from datetime import datetime, timezone
from typing import Optional

class ExpenseService:
    """Service for handling expense data operations"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.expenses
    
    async def save_month_expenses(self, data: MonthExpensesCreate) -> MonthExpensesResponse:
        """Save or update expenses for a specific month"""
        expense_data = data.model_dump()
        expense_data['updated_at'] = datetime.now(timezone.utc)
        
        # Update or insert the document
        await self.collection.update_one(
            {
                "month": data.month,
                "year": data.year
            },
            {"$set": expense_data},
            upsert=True
        )
        
        return MonthExpensesResponse(**expense_data)
    
    async def get_month_expenses(
        self, 
        year: int, 
        month: str
    ) -> Optional[MonthExpensesResponse]:
        """Retrieve expenses for a specific month"""
        expense_data = await self.collection.find_one(
            {
                "month": month,
                "year": year
            },
            {"_id": 0}  # Exclude MongoDB's _id field
        )
        
        if expense_data:
            return MonthExpensesResponse(**expense_data)
        return None
    
    async def get_year_expenses(self, year: int) -> list:
        """Retrieve all months' expenses for a year"""
        cursor = self.collection.find(
            {
                "year": year
            },
            {"_id": 0}
        )
        
        expenses = await cursor.to_list(length=12)
        return [MonthExpensesResponse(**exp) for exp in expenses]
    
    async def delete_month_expenses(self, year: int, month: str) -> bool:
        """Delete expenses for a specific month"""
        result = await self.collection.delete_one(
            {
                "month": month,
                "year": year
            }
        )
        return result.deleted_count > 0