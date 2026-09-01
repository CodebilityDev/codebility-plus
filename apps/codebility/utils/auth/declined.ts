
export function getReApplyDate(dateApplied?: Date | null): Date {
    const reapplyDate = new Date(dateApplied ?? Date.now());
    reapplyDate.setMonth(reapplyDate.getMonth() + 3);
    return reapplyDate;
}

export function getCanReApply(dateApplied?: Date | null): boolean {
    if (!dateApplied) return false;
    const reapplyDate = getReApplyDate(dateApplied);
    const now = new Date();
    return now >= reapplyDate;
}