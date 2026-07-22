from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    SmallInteger,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


if TYPE_CHECKING:
    from app.models.teacher import Teacher


class Classroom(Base):
    __tablename__ = "classes"

    __table_args__ = (
        UniqueConstraint(
            "teacher_id",
            "academic_year",
            "class_name",
            name="uq_classes_teacher_year_class_name",
        ),
        CheckConstraint(
            "grade_level BETWEEN 7 AND 12",
            name="ck_classes_grade_level",
        ),
    )

    class_id: Mapped[int] = mapped_column(primary_key=True)

    teacher_id: Mapped[int] = mapped_column(
        ForeignKey(
            "teachers.teacher_id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    class_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    academic_year: Mapped[str] = mapped_column(
        String(9),
        nullable=False,
    )

    grade_level: Mapped[int] = mapped_column(
        SmallInteger,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    teacher: Mapped[Teacher] = relationship(
        back_populates="classrooms",
    )
