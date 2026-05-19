import momentBase from 'moment-jalaali'
momentBase.loadPersian({ dialect: 'persian-modern' })

setTimeout(() => {
  // momentBase.defineLocale('ar', { parentLocale: 'ar-sa' })
  // momentBase.updateLocale('ar', { ...ar, postformat: str => str })
  momentBase.updateLocale('fa', {
    week: {
      dow: 6,
      doy: momentBase.localeData('fa').firstDayOfYear(),
    },
    weekdaysShort: ['1 شنبه', '2 شنبه', '3 شنبه', '4 شنبه', '5 شنبه', 'جمعه', 'شنبه'],
  })
}, 1)

momentBase.daysInMonth = function (year, month) {
  return momentBase({ year, month }).daysInMonth()
}

momentBase.duration.fn.format = function (input = 'HH:mm') {
  let output = input
  let milliseconds = this.asMilliseconds()
  let totalMilliseconds = 0
  let replaceRegexps = {
    years: /Y(?!Y)/g,
    months: /M(?!M)/g,
    weeks: /W(?!W)/g,
    days: /D(?!D)/g,
    hours: /H(?!H)/g,
    minutes: /m(?!m)/g,
    seconds: /s(?!s)/g,
    milliseconds: /S(?!S)/g,
  }
  let matchRegexps = {
    years: /Y/g,
    months: /M/g,
    weeks: /W/g,
    days: /D/g,
    hours: /H/g,
    minutes: /m/g,
    seconds: /s/g,
    milliseconds: /S/g,
  }
  for (let r in replaceRegexps) {
    if (replaceRegexps[r].test(output)) {
      let as = 'as' + r.charAt(0).toUpperCase() + r.slice(1)
      let value = String(Math.floor(moment.duration(milliseconds - totalMilliseconds)[as]()))
      let replacements = output.match(matchRegexps[r]).length - value.length
      output = output.replace(replaceRegexps[r], value)

      while (replacements > 0 && replaceRegexps[r].test(output)) {
        output = output.replace(replaceRegexps[r], '0')
        replacements--
      }
      output = output.replace(matchRegexps[r], '')

      let temp = {}
      temp[r] = value
      totalMilliseconds += moment.duration(temp).asMilliseconds()
    }
  }
  return output
}

//=====================================
//           CONFIG
//=====================================
const DEFAULT_LOCALE = 'fa'

const LOCALE_METHODS = {
  fa: {
    daysInMonth: 'jDaysInMonth',
    year: 'jYear',
    month: 'jMonth',
    date: 'jDate',
    day: 'day',
    week: 'week',
    // week: 'jWeek',
    dayOfYear: 'jDayOfYear',
    weekYear: 'jWeekYear',
  },
  ar: {
    daysInMonth: 'daysInMonth',
    year: 'year',
    month: 'month',
    date: 'date',
    day: 'day',
    week: 'week',
    dayOfYear: 'dayOfYear',
    weekYear: 'weekYear',
  },
  en: {
    daysInMonth: 'daysInMonth',
    year: 'year',
    month: 'month',
    date: 'date',
    day: 'day',
    week: 'week',
    dayOfYear: 'dayOfYear',
    weekYear: 'weekYear',
  },
}

const LOCALES_CONFIG = {
  fa: { dow: 6 },
  ar: { dow: 0 },
  en: { dow: 0 },
}

let locale = {
  name: DEFAULT_LOCALE,
  config: LOCALES_CONFIG[DEFAULT_LOCALE],
}

let methods = LOCALE_METHODS[locale.name]

//=====================================
//           MOMENT
//=====================================
const moment = function () {
  let date = momentBase.apply(null, arguments)
  date.locale(locale.name)
  addMethods(date)
  return date
}

const addMethods = function (date) {
  if (date === undefined) return

  let methods = LOCALE_METHODS[locale.name] || LOCALE_METHODS.fa

  const nameInLocale = (name) => {
    if (locale.name !== 'fa') name = name.replace(/j/g, '')
    return name
  }

  date.xYear = momentBase.fn[methods.year]
  date.xMonth = momentBase.fn[methods.month]
  date.xDate = momentBase.fn[methods.date]

  date.xFormat = function (format) {
    return this.format(nameInLocale(format))
  }
  date.xStartOf = function (value) {
    return this.startOf(methods[value])
  }
  date.xEndOf = function (value) {
    return this.endOf(methods[value])
  }
  date.xAdd = function (amount, key) {
    return this.add(amount, methods[key])
  }
  date.clone = function () {
    return moment(this.toDate())
  }
}

for (let key in momentBase) {
  if (Object.prototype.hasOwnProperty.call(momentBase, key)) moment[key] = momentBase[key]
}
// moment.localeData = momentBase.localeData
// moment.duration = momentBase.duration

//=====================================
//           METHODS
//=====================================
/**
 * Get current week days
 * @returns {[]}
 */
export const getCurrentWeek = function () {
  let week = []
  let date = moment().xStartOf('week')
  for (let d = 0; d < 7; d++) {
    week.push(date.clone().add(d, 'd'))
  }
  return week
}

/**
 * Get weeks as array
 * @param date
 * @returns {[]}
 */
export const getWeekArray = function (date) {
  let xDaysInMonth = momentBase[methods.daysInMonth]
  function addWeek(weekArray, week) {
    let emptyDays = 7 - week.length

    for (let i = 0; i < emptyDays; ++i) {
      if (weekArray.length) {
        // push
        let last = week[week.length - 1]
        week.push(getDay(last.date.clone().add(1, 'day'), false))
      } else {
        // unshift
        let day = getDay(week[0].date.clone().subtract(1, 'day'), false)
        week.unshift(day)
      }
    }

    weekArray.push(week)
  }

  function getDay(day, isInMonth = true) {
    return {
      isInMonth,
      date: day.clone(),
      formatted: day.format('YYYY-MM-DD'),
    }
  }

  date.set({ h: 12, m: 0 })
  let daysInMonth = xDaysInMonth(date.xYear(), date.xMonth())
  let day = date.clone().xDate(1)
  let dayArray = [getDay(day)]

  for (let i = 2; i <= daysInMonth; i++) {
    dayArray.push(getDay(day.add(1, 'day')))
  }

  let weekArray = []
  let week = []

  dayArray.forEach((day) => {
    if (week.length > 0 && day.date.day() === 6) {
      addWeek(weekArray, week)
      week = []
    }

    week.push(day)
    if (dayArray.indexOf(day) === dayArray.length - 1) {
      addWeek(weekArray, week)
    }
  })
  return weekArray
}

export const getYearsList = function (from, to, range = false, date) {
  let years = []
  if (range) {
    let year = window.getYear(date)
    from = year - range
    to = year + range
  }
  for (let i = from; i <= to; i++) {
    years.push(i)
  }
  return years
}

export const getMonthsList = function (minDate, maxDate, date) {
  let list = [],
    min = minDate ? minDate.clone().xStartOf('month') : -Infinity,
    max = maxDate ? maxDate.clone().xEndOf('month') : Infinity
  for (let i = 0; i < 12; i++) {
    let month = date.clone().xMonth(i)
    let start = month.clone().xStartOf('month')
    let end = month.clone().xEndOf('month')
    month.disabled = start < min || end > max
    list.push(month)
  }
  return list
}

//=====================================
//           LOCALIZE
//=====================================
export const localize = function (localeName = 'fa', options = {}) {
  let config = JSON.parse(JSON.stringify(LOCALES_CONFIG[localeName] || LOCALES_CONFIG.fa))
  methods = LOCALE_METHODS[localeName] || LOCALE_METHODS.fa
  options = options[localeName] || {}
  locale.name = localeName
  locale.config = { ...config, ...options }

  momentBase.locale(localeName)
}

localize(DEFAULT_LOCALE)

export default moment
