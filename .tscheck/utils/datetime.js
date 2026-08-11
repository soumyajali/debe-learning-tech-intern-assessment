"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineLocalDateAndTime = combineLocalDateAndTime;
exports.formatUtcForLocalDisplay = formatUtcForLocalDisplay;
exports.formatDateInputValue = formatDateInputValue;
exports.formatTimeInputValue = formatTimeInputValue;
// Shared browser-only helpers for the small reschedule workflow.
// The parent sees and chooses a date/time in their local browser time.
// That local date/time is then represented as a JavaScript Date object,
// and we ask the Date API to serialize it as an ISO UTC string.
function combineLocalDateAndTime(dateValue, timeValue) {
    if (!dateValue || !timeValue) {
        return null;
    }
    const dateParts = dateValue.split("-");
    const timeParts = timeValue.split(":");
    if (dateParts.length !== 3 || timeParts.length !== 2) {
        return null;
    }
    const year = Number(dateParts[0]);
    const month = Number(dateParts[1]);
    const day = Number(dateParts[2]);
    const hour = Number(timeParts[0]);
    const minute = Number(timeParts[1]);
    if ([year, month, day, hour, minute].some((value) => Number.isNaN(value)) ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        hour < 0 ||
        hour > 23 ||
        minute < 0 ||
        minute > 59) {
        return null;
    }
    const localDate = new Date(year, month - 1, day, hour, minute, 0, 0);
    if (Number.isNaN(localDate.getTime())) {
        return null;
    }
    return localDate;
}
function formatUtcForLocalDisplay(utcIsoString) {
    const date = new Date(utcIsoString);
    if (Number.isNaN(date.getTime())) {
        return "Invalid date";
    }
    return new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}
function formatDateInputValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
function formatTimeInputValue(date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}
