document.addEventListener('DOMContentLoaded',()=>{
  const expenseForm=document.getElementById("expense-form")
  const expenseNameInput=document.getElementById("expense-name")
  const expenseAmountInput=document.getElementById("expense-amount")
  const expenseDateInput=document.getElementById("expenseDate")
  const expenseCategoryInput=document.getElementById("expenseCategory")
  const expenseList=document.getElementById("expense-list")
  const totalAmountDisplay=document.getElementById("total-amount")
  const sortOptions=document.getElementById("sort-options")
  const filterCategory=document.getElementById("filter-category")


  let expenses=JSON.parse(localStorage.getItem('expenses'))||[];
  renderExpenses()
  updateTotal()
   

  expenseForm.addEventListener("submit",(e)=>{
       e.preventDefault();
       const name=expenseNameInput.value.trim();
       const amount=parseFloat(expenseAmountInput.value.trim());
       const category=expenseCategoryInput.value.trim()
       const date = expenseDateInput.value || new Date().toISOString().split('T')[0];

       if(name!=="" && !isNaN(amount)  && amount>0)
       {
          const expense={
            id:Date.now(),
            name:name,
            amount:amount,
            category:category,
            date:date
          }

          expenses.push(expense) 
          saveExpensesTolocal()
          renderExpenses()
          updateTotal()

          expenseNameInput.value = "";
          expenseAmountInput.value = "";
          expenseCategoryInput.value=""
          expenseDateInput.value=""
          
       }
  })
   
    function renderExpenses(filterCategoryValue="",sortOptions=""){

      expenseList.innerHTML="";
      let filteredExpenses=expenses
      
      if(filterCategoryValue!=="")
      {
        filteredExpenses=filteredExpenses.filter((expense)=> expense.category===filterCategoryValue)
      }

      if (sortOptions === "amount-asc") {
        filteredExpenses.sort((a, b) => a.amount - b.amount);
      } else if (sortOptions === "amount-desc") {
        filteredExpenses.sort((a, b) => b.amount - a.amount);
      } else if (sortOptions === "date-asc") {
        filteredExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else if (sortOptions === "date-desc") {
        filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
  



      filteredExpenses.forEach(expense => {
        const li=document.createElement("li")
        li.classList.add("expense-item");
        li.innerHTML=`<div class="expense-details">
          <span class="expense-name">${expense.name}</span>
          <span class="expense-category">${expense.category}</span>
                         </div>
          <div class="expense-meta">
          <span class="expense-amount">₹${expense.amount.toFixed(2)}</span>
          <span class="expense-date">${expense.date}</span>
          <button data-id="${expense.id}" class="delete-btn">Delete</button>
           </div>`
        expenseList.appendChild(li)
      });
    }

    




  function calculateTotal(){
    return expenses.reduce((sum,expense)=>sum + expense.amount,0)
  }

  function updateTotal(){
    const totalAmount=calculateTotal();
    totalAmountDisplay.textContent=`${totalAmount.toFixed(2)}`;
  }

  function saveExpensesTolocal(){
    localStorage.setItem('expenses',JSON.stringify(expenses))
  }


  expenseList.addEventListener("click",(e)=>{
    if(e.target.tagName==="BUTTON")
    {
      const expenseId=parseInt(e.target.getAttribute("data-id"))
      expenses=expenses.filter((expense)=> expense.id!==expenseId)

      saveExpensesTolocal();
    renderExpenses();
    updateTotal();

    }

  })

  sortOptions.addEventListener("change",()=>{
    renderExpenses(filterCategory.value,sortOptions.value)
  })

  filterCategory.addEventListener("change", () => {
    renderExpenses(filterCategory.value, sortOptions.value);
  });

  expenseDateInput.value = new Date().toISOString().split('T')[0];

})