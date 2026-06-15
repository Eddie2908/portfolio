from fastapi import APIRouter, HTTPException, Query
from app.services.project_service import get_all_projects, get_project_by_id

router = APIRouter()


@router.get("")
def get_projects(
    category: str = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    return get_all_projects(category=category, page=page, limit=limit)


@router.get("/{project_id}")
def get_project(project_id: int):
    project = get_project_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")
    return project
