export const difficulties = ['קל', 'בינוני', 'קשה'];

export const getDifficulty = (diff) => {
    if (diff == 5)
        return 'קשה'
    if (diff > 2 && diff < 5)
        return 'בינוני'
    return 'קל'
}

export const minutesToHours = (value) => {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    if (hours === 0) {
        return `${minutes} דקות`;
    }
    if (minutes === 0) {
        if (hours === 1) {
            return `שעה`
        }
        return `${hours} שעות`
    }
    if (hours === 1) {
        return `שעה ו-${minutes} דקות`
    }

    return `${hours} שעות ו-${minutes} דקות`;
}
