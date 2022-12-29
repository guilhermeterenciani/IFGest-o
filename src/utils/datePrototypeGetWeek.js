Date.prototype.getWeek = function(weekStart) {
    var januaryFirst = new Date(this.getFullYear(), 0, 1)
    if (
        weekStart !== undefined &&
        (typeof weekStart !== "number" ||
            weekStart % 1 !== 0 ||
            weekStart < 0 ||
            weekStart > 6)
    ) {
        throw new Error("Wrong argument. Must be an integer between 0 and 6.")
    }
    weekStart = weekStart || 0
    return Math.floor(
        ((this - januaryFirst) / 86400000 + januaryFirst.getDay() - weekStart) /
            7,
    )
}
export {}
