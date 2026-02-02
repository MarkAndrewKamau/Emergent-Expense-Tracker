from fastapi import APIRouter, HTTPException
from models.expense import MonthExpensesCreate, MonthExpensesResponse
from services.expense_service import ExpenseService
from typing import List

def create_expense_router(expense_service: ExpenseService) -> APIRouter:
    """Create and configure the expense router"""
    router = APIRouter(prefix="/expenses", tags=["expenses"])
    
    @router.post("/save", response_model=MonthExpensesResponse)
    async def save_month_expenses(data: MonthExpensesCreate):
        """Save or update expenses for a specific month"""
        try:
            result = await expense_service.save_month_expenses(data)
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.get("/{year}/{month}", response_model=MonthExpensesResponse)
    async def get_month_expenses(year: int, month: str):
        """Get expenses for a specific month"""
        result = await expense_service.get_month_expenses(year, month)
        
        if not result:
            raise HTTPException(
                status_code=404, 
                detail=f"No expenses found for {month} {year}"
            )
        
        return result
    
    @router.get("/year/{year}", response_model=List[MonthExpensesResponse])
    async def get_year_expenses(year: int):
        """Get all expenses for a year"""
        try:
            result = await expense_service.get_year_expenses(year)
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.delete("/{year}/{month}")
    async def delete_month_expenses(year: int, month: str):
        """Delete expenses for a specific month"""
        success = await expense_service.delete_month_expenses(year, month)
        
        if not success:
            raise HTTPException(
                status_code=404,
                detail=f"No expenses found to delete for {month} {year}"
            )
        
        return {"message": f"Expenses for {month} {year} deleted successfully"}
    
    return router