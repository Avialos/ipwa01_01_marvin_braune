import type {
    Clothing,
    CrisisRegion,
    DeliveryMode,
    PickupTimeSlot
} from "../state/registrationState.ts";

export interface DonationFormData {
    mode: DeliveryMode;
    clothingType: Clothing;
    crisisRegion: CrisisRegion;
    street?: string;
    postalCode?: string;
    city?: string;
    pickupDate?: string;
    pickupTimeSlot?: PickupTimeSlot;

}

export type DonationFieldErrorKey = keyof DonationFormData;
export type DonationFieldErrors = Partial<Record<DonationFieldErrorKey, string>>;

export type DonationValidationResult =
    | { ok: true}
    | {ok: false; errors: DonationFieldErrors}

const GERMAN_PLZ_REGEX =  /^\d{5}$/
const YYYYMMDD_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/

function pad2(value: number) : string {
    return String(value).padStart(2, '0')
}

function toYyyymmdd(date: Date) : string {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

function startOfDay(date: Date) : Date {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
}

function parseYyyymmdd(value: string) : Date | null {
    const match = YYYYMMDD_REGEX.exec(value)
    if (!match) {
        return null
    }

    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])

    const parsed = new Date(year, month -1, day)
    parsed.setHours(0, 0, 0, 0)

    if(
        parsed.getFullYear() !== year ||
        parsed.getMonth() !== month -1 ||
        parsed.getDate() !== day
    ) {
        return null
    }
    return parsed
}

export function getAvailablePickupDates(today = new Date(), count = 30) : string[] {
    const result : string[] = []
    const current = startOfDay(today)
    current.setDate(current.getDate() + 3)

    let daysChecked = 0
    const maxDaysToCheck = Math.max(count *3, 30)

    while (result.length < count && daysChecked < maxDaysToCheck) {
        const dayOfWeek = current.getDay()
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            result.push(toYyyymmdd(current))
        }
        current.setDate(current.getDate() + 1)
        daysChecked++
    }

    return result
}

export function isPickupDateAvailable(pickupDate: string, today = new Date()): boolean {
    const parsed = parseYyyymmdd(pickupDate)
    if (!parsed) {
        return false
    }

    const dayOfWeek = parsed.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return false
    }

    const minDate = startOfDay(today)
    minDate.setDate(minDate.getDate() + 3)

    return parsed.getTime() >= minDate.getTime()
}

export function isNearOffice(donorPLZ: string, officePLZ: string) : boolean {
    if (!GERMAN_PLZ_REGEX.test(donorPLZ) || !GERMAN_PLZ_REGEX.test(officePLZ)) {
        return false
    }

    // Prüft, ob die ersten 2 Zahlen gleich sind
    return donorPLZ.slice(0, 2) === officePLZ.slice(0, 2)
}

export function validateDonation(
    data: DonationFormData,
    officePLZ: string,
    today = new Date()
): DonationValidationResult {
    const errors: DonationFieldErrors = {}

    if (!data.clothingType?.trim()) {
        errors.clothingType = 'Bitte wählen Sie eine Art der Kleidung aus.'
    }

    if (!data.crisisRegion?.trim()) {
        errors.crisisRegion = 'Bitte wählen Sie ein Krisengebiet aus.'
    }

    if (data.mode === 'pickup') {
        if (!data.street?.trim()) {
            errors.street = 'Bitte geben Sie eine Straße und Hausnummer an.'
        }

        const plz = data.postalCode?.trim() ?? ''
        if (!plz) {
            errors.postalCode = 'Bitte geben Sie eine Postleitzahl an.'
        } else if (!GERMAN_PLZ_REGEX.test(plz)) {
            errors.postalCode = 'Die Postleitzahl muss aus genau fünf Zahlen bestehen.'
        } else if (!isNearOffice(plz, officePLZ)) {
            errors.postalCode =
                'Die Abholadresse liegt zu weit von der Geschäftsstelle entfernt (PLZ-Bereich ungleich).'
        }

        if (!data.city?.trim()) {
            errors.city = 'Bitte geben Sie einen Ort an.'
        }

        if (!data.pickupDate?.trim()) {
            errors.pickupDate = 'Bitte wählen Sie ein Abholungsdatum aus.'
        } else if (!isPickupDateAvailable(data.pickupDate.trim(), today)) {
            errors.pickupDate =
                'Das ausgewählte Abholungsdatum ist nicht verfügbar (mind. 3 Tage Vorlauf, nur Montag bis Freitag).'
        }

        if (!data.pickupTimeSlot) {
            errors.pickupTimeSlot = 'Bitte wählen Sie einen Abholungszeitslot aus.'
        }
    }

    if (Object.keys(errors).length > 0) {
        return { ok: false, errors }
    }

    return { ok: true }
}


export function formatDonationDate(timestamp: number, locale = 'de-DE'): string {
    const d = new Date (timestamp)
    const date = new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(d)

    const time = new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit'
    }).format(d)
    return `${date} ${time}`
}