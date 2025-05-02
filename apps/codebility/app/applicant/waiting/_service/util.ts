
export function getTestDate(dateApplied: Date): Date {
    const testDate = new Date(dateApplied);
    testDate.setDate(testDate.getDate() + 4);
    return testDate;
}

/* export function getCanReApply(dateApplied: Date): boolean {
    const reapplyDate = getReApplyDate(dateApplied);
    const now = new Date();
    return now >= reapplyDate;
} */