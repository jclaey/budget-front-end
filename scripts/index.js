const results = document.querySelector('#results')
const budgetCategoryBtn = document.querySelector('#budget-category-btn')
const budgetCategoryInput = document.querySelector('#budget-category-input')
const categorySpendingSelect = document.querySelector('#category-spending-select')
const categorySpendingBtn = document.querySelector('#set-category-spending-btn')
const categorySpendingInput = document.querySelector('#set-category-spending-input')
const categorySelect = document.querySelector('#category-select')
const expenseBtn = document.querySelector('#expense-btn')
const incomeBtn = document.querySelector('#income-btn')
const incomeInput = document.querySelector('#income')
const expenseInput = document.querySelector('#expense')
const radioMonth = document.querySelector('#radio-month')
const radioYear = document.querySelector('#radio-year')
const radioBoth = document.querySelector('#radio-both')
const radioAllTime = document.querySelector('#radio-all-time')
const yearSelect = document.querySelector('#year-select')
const monthSelect = document.querySelector('#month-select')
import { buildBudget } from "./buildBudget.mjs"

const setOptions = (arr, el) => {
    arr.forEach(item => {
        const option = document.createElement('option')
        if (el.childNodes.length !== arr.length) {
            el.appendChild(option)
            option.textContent = item.title
        }
    })
}

const renderBudget = () => {
    const date = new Date()
    const months = [
        'January', 
        'February', 
        'March', 
        'April', 
        'May', 
        'June', 
        'July', 
        'August', 
        'September', 
        'October', 
        'November', 
        'December'
    ]
    const month = date.getMonth()
    const year = date.getFullYear()

    if (!localStorage.getItem('budget')) {
        const budget = {
            years: [
                {
                    title: year.toString(),
                    months: [
                        {
                            title: months[month],
                            limit: 0,
                            totalSpent: 0,
                            variance: 0,
                            income: 0,
                            netIncome: 0,
                            categories: [
                                {
                                    title: 'Other',
                                    limit: 0,
                                    totalSpent: 0,
                                    variance: 0
                                }
                            ]
                        }
                    ],
                    limit: 0,
                    totalSpent: 0,
                    variance: 0,
                    income: 0,
                    netIncome: 0,
                    categories: []
                }
            ],
            limit: 0,
            totalSpent: 0,
            variance: 0,
            income: 0,
            netIncome: 0,
            categories: []
        }

        localStorage.setItem('budget', JSON.stringify(budget))
    }

    const storedBudget = JSON.parse(localStorage.getItem('budget'))

    const currentBudgetYear = storedBudget.years[storedBudget.years.length - 1]
    const currentBudgetMonth = currentBudgetYear.months[currentBudgetYear.months.length - 1]

    // what to do if year has changed
    if (storedBudget && year !== Number(currentBudgetYear.title)) {
        storedBudget.years.push({
            title: year.toString(),
            months: [
                {
                    title: months[month],
                    limit: 0,
                    totalSpent: 0,
                    variance: 0,
                    income: 0,
                    netIncome: 0,
                    categories: [
                        {
                            title: 'Other',
                            limit: 0,
                            totalSpent: 0,
                            variance: 0
                        }
                    ]
                }
            ],
            limit: 0,
            totalSpent: 0,
            variance: 0,
            income: 0,
            netIncome: 0,
            categories: []
        })

        localStorage.setItem('budget', JSON.stringify(storedBudget))
    }

    // what to do if month has changed
    if (storedBudget && months[month] !== currentBudgetMonth.title) {
        currentBudgetYear.months.push({
            title: months[month],
            limit: 0,
            totalSpent: 0,
            variance: 0,
            income: 0,
            netIncome: 0,
            categories: [
                {
                    title: 'Other',
                    limit: 0,
                    totalSpent: 0,
                    variance: 0
                }
            ]
        })

        localStorage.setItem('budget', JSON.stringify(storedBudget))
    }

    categorySpendingSelect.innerHTML = ''
    categorySelect.innerHTML = ''

    setOptions(currentBudgetMonth.categories, categorySpendingSelect)
    setOptions(currentBudgetMonth.categories, categorySelect)

    if (radioBoth.hasAttribute('checked')) {
        renderBoth()
    } else if (radioMonth.hasAttribute('checked')) {
        renderMonth()
    } else if (radioYear.hasAttribute('checked')) {
        renderYear()
    } else {
        renderAllTime()
    }
}

const renderBoth = () => {
    yearSelect.removeAttribute('disabled')
    monthSelect.removeAttribute('disabled')
    const storedBudget = JSON.parse(localStorage.getItem('budget'))

    let output = ''

    setOptions(storedBudget.years, yearSelect)
    const yearIndex = storedBudget.years.findIndex(year => year.title === yearSelect.value)
    setOptions(storedBudget.years[yearIndex].months, monthSelect)
    const monthIndex = storedBudget.years[yearIndex].months.findIndex(year => year.title === monthSelect.value)
    const month = storedBudget.years[yearIndex].months[monthIndex]
    const year = storedBudget.years[yearIndex]
    const positiveVariance = month.variance > 0
    const positiveIncome = month.income > 0

    yearSelect.addEventListener('change', renderBoth)
    monthSelect.addEventListener('change', renderBoth)

    output += `
        <div>
            <h3>${month.title} ${year.title}</h3>
            <p>Spending Limit: $${month.limit}</p>
            <p>Amount Spent: $${month.totalSpent}</p>
            <p>Limit Variance: $<span style="color: ${positiveVariance ? 'green' : 'red'};">
                ${positiveVariance ? '+' : ''}${month.variance}
            </span></p>
            <p>Income: $${month.income}</p>
            <p>Net Income: $<span style="color: ${positiveIncome ? 'green' : 'red'};">
                ${positiveIncome ? '+' : ''}${month.netIncome}
            </span></p>
        </div>
    `

    results.innerHTML = output
}

const renderMonth = () => {
    monthSelect.removeAttribute('disabled')
    yearSelect.setAttribute('disabled', true)

    const storedBudget = JSON.parse(localStorage.getItem('budget'))

    let output = ''

    monthSelect.addEventListener('change', renderMonth)

    const months = []

    storedBudget.years.forEach(year => {
        year.months.forEach(month => {
            months.push(month)
        })
    })

    setOptions(months, monthSelect)
    const monthIndex = months.findIndex(month => month.title === monthSelect.value)
    const month = months[monthIndex]

    const allMonths = {}

    const findValues = () => {
        let limit = 0
        let totalSpent = 0
        let income = 0
        let numMonths = 0

        storedBudget.years.forEach(year => {
            let targetMonth = year.months.find(m => m.title === month.title)

            limit += targetMonth.limit
            totalSpent += targetMonth.totalSpent
            income += targetMonth.income

            numMonths += 1
        })
 
        allMonths.numMonths = numMonths
        allMonths.limit = limit
        allMonths.avgLimit = limit / numMonths
        allMonths.totalSpent = totalSpent
        allMonths.avgTotalSpent = totalSpent / numMonths
        allMonths.variance = limit - totalSpent
        allMonths.avgVariance = (limit - totalSpent) / numMonths
        allMonths.income = income
        allMonths.avgIncome = income / numMonths
        allMonths.netIncome = income - totalSpent
        allMonths.avgNetIncome = (income - totalSpent) / numMonths
    }

    findValues()
    
    const positiveVariance = allMonths.variance > 0
    const positiveAvgVariance = allMonths.avgVariance > 0
    const positiveIncome = allMonths.income > 0
    const positiveAvgIncome = allMonths.avgIncome > 0

    output += `
        <div>
            <h3>${month.title}</h3>
            <p>Total Spending Limit for All ${month.title} months: $${allMonths.limit}</p>
            <p>Average Spending Limit for ${month.title} months: $${allMonths.avgLimit}</p>
            <p>Total Amount Spent for All ${month.title} months: $${allMonths.totalSpent}</p>
            <p>Average Amount Spent for ${month.title} months: $${allMonths.avgTotalSpent}</p>
            <p>
                Limit Variance for All ${month.title} months: $<span style="color: ${positiveVariance ? 'green' : 'red'};">
                ${positiveVariance ? '+' : ''}${allMonths.variance}</span>
            </p>
            <p>Average Limit Variance for ${month.title} months: $<span style="color: ${positiveAvgVariance ? 'green' : 'red'};">
            ${positiveAvgVariance ? '+' : ''}${allMonths.avgVariance}</p>
            <p>Monthly Income for All ${month.title} months: $${allMonths.income}</p>
            <p>Average Income for ${month.title} months: $${allMonths.avgIncome}</p>
            <p>
                Net Monthly Income for All ${month.title} months: $<span style="color: ${positiveIncome ? 'green' : 'red'};">
                ${positiveIncome ? '+' : ''}${allMonths.netIncome}</span>
            </p>
            <p>Average Net Monthly Income for ${month.title} months: $<span style="color: ${positiveAvgIncome ? 'green' : 'red'};">
            ${positiveAvgIncome ? '+' : ''}${allMonths.avgNetIncome}</span>
        </div>
    `

    results.innerHTML = output
}

const renderYear = () => {
    yearSelect.removeAttribute('disabled')
    monthSelect.setAttribute('disabled', true)

    const storedBudget = JSON.parse(localStorage.getItem('budget'))

    let output = ''

    const years = []

    storedBudget.years.forEach(year => {
        years.push(year)
    })

    setOptions(years, yearSelect)
    const yearIndex = years.findIndex(year => year.title === yearSelect.value)
    const year = years[yearIndex]
    
    const positiveVariance = year.variance > 0
    const positiveIncome = year.income > 0

    output += `
        <div>
            <h3>${year.title}</h3>
            <p>Total Spending Limit for ${year.title}: $${year.limit}</p>
            <p>Total Amount Spent for ${year.title}: $${year.totalSpent}</p>
            <p>
                Limit Variance for ${year.title}: $
                <span style="color: ${positiveVariance ? 'green' : 'red'};">${positiveVariance ? '+' : ''}${year.variance}</span>
            </p>
            <p>Total Income for ${year.title}: $${year.income}</p>
            <p>
                Total Net Income for ${year.title}: $
                <span style="color: ${positiveIncome ? 'green' : 'red'};">${positiveIncome ? '+' : ''}${year.netIncome}</span>
            </p>
        </div>
    `

    results.innerHTML = output
}

const renderAllTime = () => {
    yearSelect.setAttribute('disabled', true)
    monthSelect.setAttribute('disabled', true)
    
    const storedBudget = JSON.parse(localStorage.getItem('budget'))

    let output = ''
    
    const positiveVariance = storedBudget.variance > 0
    const positiveIncome = storedBudget.income > 0

    output += `
        <div>
            <h3>Budget All-Time</h3>
            <p>Total Spending Limit All-Time: $${storedBudget.limit}</p>
            <p>Total Amount Spent All-Time: $${storedBudget.totalSpent}</p>
            <p>
                Limit Variance All-Time: $
                <span style="color: ${positiveVariance ? 'green' : 'red'};">${positiveVariance ? '+' : ''}${storedBudget.variance}</span>
            </p>
            <p>Income All-Time: $${storedBudget.income}</p>
            <p>
                Net Income All-Time: $
                <span style="color: ${positiveIncome ? 'green' : 'red'};">${positiveIncome ? '+' : ''}${storedBudget.netIncome}</span>
            </p>
        </div>
    `

    results.innerHTML = output
}

const addExpense = e => {
    const storedBudget = JSON.parse(localStorage.getItem('budget'))
    const currentBudgetYear = storedBudget.years[storedBudget.years.length - 1]
    const currentBudgetMonth = currentBudgetYear.months[currentBudgetYear.months.length - 1]

    const index = currentBudgetMonth.categories.findIndex(category => category.title === categorySelect.value)

    currentBudgetMonth.categories[index].totalSpent = Number(expenseInput.value)

    localStorage.setItem('budget', JSON.stringify(buildBudget(storedBudget)))

    expenseInput.value = ''
    renderBudget()
}

const addIncome = e => {
    const storedBudget = JSON.parse(localStorage.getItem('budget'))
    const currentBudgetYear = storedBudget.years[storedBudget.years.length - 1]
    const currentBudgetMonth = currentBudgetYear.months[currentBudgetYear.months.length - 1]

    const index = currentBudgetMonth.categories.findIndex(category => category.title === categorySelect.value)

    currentBudgetMonth.categories[index].income = Number(incomeInput.value)

    localStorage.setItem('budget', JSON.stringify(buildBudget(storedBudget)))

    incomeInput.value = ''
    renderBudget()
}

const createCategory = e => {
    let storedBudget = JSON.parse(localStorage.getItem('budget'))
    let currentBudgetYear = storedBudget.years[storedBudget.years.length - 1]
    let currentBudgetMonth = currentBudgetYear.months[currentBudgetYear.months.length - 1]

    const existing = currentBudgetMonth.categories.find(category => category.title === budgetCategoryInput.value)

    if (existing !== undefined) {
        return
    }
    
    currentBudgetMonth.categories.push({
        title: budgetCategoryInput.value,
        limit: 0,
        totalSpent: 0,
        variance: 0
    })

    localStorage.setItem('budget', JSON.stringify(buildBudget(storedBudget)))

    storedBudget = JSON.parse(localStorage.getItem('budget'))
    currentBudgetYear = storedBudget.years[storedBudget.years.length - 1]
    currentBudgetMonth = currentBudgetYear.months[currentBudgetYear.months.length - 1]

    setOptions(currentBudgetMonth.categories, categorySpendingSelect)
    setOptions(currentBudgetMonth.categories, categorySelect)

    renderBudget()
}

const setCategorySpendingLimit = e => {
    let storedBudget = JSON.parse(localStorage.getItem('budget'))
    const currentBudgetYear = storedBudget.years[storedBudget.years.length - 1]
    const currentBudgetMonth = currentBudgetYear.months[currentBudgetYear.months.length - 1]

    const index = currentBudgetMonth.categories.findIndex(category => category.title === categorySpendingSelect.value)

    currentBudgetMonth.categories[index].limit = Number(categorySpendingInput.value)

    storedBudget = buildBudget(storedBudget)

    console.log(storedBudget)

    localStorage.setItem('budget', JSON.stringify(buildBudget(storedBudget)))

    categorySpendingInput.value = ''
    renderBudget()
}

radioAllTime.addEventListener('change', renderAllTime)
radioBoth.addEventListener('change', renderBoth)
radioMonth.addEventListener('change', renderMonth)
radioYear.addEventListener('change', renderYear)
expenseBtn.addEventListener('click', addExpense)
incomeBtn.addEventListener('click', addIncome)
budgetCategoryBtn.addEventListener('click', createCategory)
categorySpendingBtn.addEventListener('click', setCategorySpendingLimit)

renderBudget()
renderBoth()