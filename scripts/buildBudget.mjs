const buildBudget = budget => {
    const allCategories = []
    let allIncome = 0
    let allLimit = 0
    let allVariance = 0
    let allTotalSpent = 0
    let allNetIncome = 0
    let index

    budget.years.forEach(year => {
        const categories = []
        let yearlyIncome = 0
        let yearlyLimit = 0
        let yearlyTotalSpent = 0

        year.months.forEach(month => {
            let monthlyIncome = 0
            let monthlyLimit = 0
            let monthlyTotalSpent = 0

            month.categories.forEach(category => {
                category.variance = category.limit - category.totalSpent
                monthlyLimit += category.limit
                monthlyTotalSpent += category.totalSpent
                monthlyIncome += category.income

                index = categories.findIndex(el => el.title === category.title)
                if (index !== -1) {
                    categories[index] = {
                        ...category, 
                        limit: categories[index].limit + category.limit, 
                        totalSpent: categories[index].totalSpent + category.totalSpent,
                        variance: (categories[index].limit + category.limit) - (categories[index].totalSpent + category.totalSpent)
                    }
                } else {
                    categories.push(category)
                }
            })

            month.limit = monthlyLimit || 0
            month.totalSpent = monthlyTotalSpent || 0
            month.income = monthlyIncome || 0
            month.variance = monthlyLimit - monthlyTotalSpent || 0
            month.netIncome = month.income - monthlyTotalSpent || 0

            yearlyLimit += month.limit
            yearlyTotalSpent += month.totalSpent

            yearlyIncome += month.income
        })

        year.categories = categories
        categories.forEach(category => {
            index = allCategories.findIndex(el => el.title === category.title)
            if (index !== -1) {
                allCategories[index] = {
                    ...category, 
                    limit: allCategories[index].limit + category.limit, 
                    totalSpent: allCategories[index].totalSpent + category.totalSpent,
                    variance: (allCategories[index].limit + category.limit) - (allCategories[index].totalSpent + category.totalSpent)
                }
            } else {
                allCategories.push(category)
            }
        })
        
        year.income = yearlyIncome || 0
        year.limit = yearlyLimit || 0
        year.totalSpent = yearlyTotalSpent || 0
        year.variance = yearlyLimit - yearlyTotalSpent || 0
        year.netIncome = year.income - yearlyTotalSpent || 0

        allIncome += year.income
        allLimit += year.limit
        allTotalSpent += year.totalSpent
        allVariance += year.limit - year.totalSpent
        allNetIncome += year.income - year.totalSpent
    })

    budget.limit = allLimit || 0
    budget.totalSpent = allTotalSpent || 0
    budget.variance = allVariance || 0
    budget.income = allIncome || 0
    budget.netIncome = allNetIncome || 0

    budget.categories = allCategories
    
    return budget
}

export { buildBudget }

// class Budget {
//     constructor() {

//     }
// }