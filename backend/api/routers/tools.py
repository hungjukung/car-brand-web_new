from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class FuelCalcRequest(BaseModel):
    distance_km: float
    fuel_consumption: float  # L/100km
    fuel_price: float        # NTD per liter


class FuelCalcResult(BaseModel):
    total_liters: float
    total_cost: float
    cost_per_km: float


class LoanCalcRequest(BaseModel):
    car_price: int
    down_payment: int
    loan_years: int
    annual_rate: float


class LoanCalcResult(BaseModel):
    loan_amount: int
    monthly_payment: float
    total_payment: float
    total_interest: float


@router.post("/fuel-calculator", response_model=FuelCalcResult)
async def fuel_calculator(req: FuelCalcRequest):
    total_liters = req.distance_km * req.fuel_consumption / 100
    total_cost = total_liters * req.fuel_price
    cost_per_km = total_cost / req.distance_km if req.distance_km else 0
    return FuelCalcResult(
        total_liters=round(total_liters, 2),
        total_cost=round(total_cost, 0),
        cost_per_km=round(cost_per_km, 2),
    )


@router.post("/loan-calculator", response_model=LoanCalcResult)
async def loan_calculator(req: LoanCalcRequest):
    loan_amount = req.car_price - req.down_payment
    monthly_rate = req.annual_rate / 100 / 12
    n = req.loan_years * 12

    if monthly_rate == 0:
        monthly_payment = loan_amount / n
    else:
        monthly_payment = loan_amount * (monthly_rate * (1 + monthly_rate) ** n) / ((1 + monthly_rate) ** n - 1)

    total_payment = monthly_payment * n
    total_interest = total_payment - loan_amount

    return LoanCalcResult(
        loan_amount=loan_amount,
        monthly_payment=round(monthly_payment, 0),
        total_payment=round(total_payment, 0),
        total_interest=round(total_interest, 0),
    )
