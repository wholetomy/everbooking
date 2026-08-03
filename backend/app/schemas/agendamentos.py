from pydantic import BaseModel
from datetime import datetime

class CriarAgendamentoSchema(BaseModel):
    cod_sala: int
    horario_inicial: datetime
    horario_final: datetime

class EditarAgendamentoSchema(BaseModel):
    horario_inicial: datetime
    horario_final: datetime