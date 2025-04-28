
export function getReApplyDate(dateApplied: Date): Date {
    const reapplyDate = new Date(dateApplied);
    reapplyDate.setMonth(reapplyDate.getMonth() + 3);
    return reapplyDate;
}

export function getCanReApply(dateApplied: Date): boolean {
    const reapplyDate = getReApplyDate(dateApplied);
    const now = new Date();
    return now >= reapplyDate;
}