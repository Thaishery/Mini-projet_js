const navList = document.getElementById("nav")
const errorContainer = document.getElementById("error")
const main = document.getElementById("main")
if(!window.localStorage){
  showError("Votre navigateur internet semble ne pas être compatible")
}
if(!localStorage.getItem("isAuth"))localStorage.setItem("isAuth", false)
function disconect(){
  if(navList.childNodes[3]){
    navList.removeChild(navList.childNodes[3])
  }
  if(main.childNodes.length){
    main.removeChild(main.childNodes[1])
    main.removeChild(main.childNodes[0])
  }
  appendNavLogin()
  localStorage.setItem("isAuth", false)
  localStorage.removeItem("curUserId")
}
function showError(errorText){
  let error = document.createElement("p")
  error.innerText = errorText
  if(errorContainer.childNodes.length < 2)
  errorContainer.append(error)
  else{
    errorContainer.removeChild(errorContainer.childNodes[1])
    errorContainer.append(error)
  }
}
function clearError(){
  if(errorContainer.childNodes.length>1)
  errorContainer.removeChild(errorContainer.childNodes[1])
}
function renderDashboard(){
  if(main.childNodes.length){
    main.removeChild(main.childNodes[0])
  }
  const user = JSON.parse(localStorage.getItem("users"))
  const curUser = user[parseInt(localStorage.getItem("curUserId")-1)]
  let title = document.createElement("h2")
  title.innerText = `bienvenue ${curUser.prenom} ${curUser.nom}`
  let lastLogin = document.createElement("section")
  lastLogin.innerText = `Votre dernier connection etais le : ${new Date(parseInt(localStorage.getItem("lastLogin")))}`
  main.append(title, lastLogin)
}
function renderClient(){
  console.log("ok")
}
function handleConnectionForm(email, password){
  if(localStorage.getItem("users")){
    var users = JSON.parse(localStorage.getItem("users"))
  }
  if(users){
    users.forEach(user=>{
      if(user.email === email){
        if(user.password === password){
          localStorage.setItem("isAuth", true)
          localStorage.setItem("curUserId", user.id)
          localStorage.setItem("lastLogin",Date.now())
          if(navList.childNodes[3]){
            navList.removeChild(navList.childNodes[3])
          }
          appendNavLogout()
          renderDashboard()
        }else{
          showError("password Invalide")
        }
      }else{
        showError("email invalide")
      }
    })
  }else{
    showError("pas d'utilisateur trouvé")
  }
}
function validateUser(nom,prenom,email,password,age,grade,adresse,tel){
  const letteRegex = /[a-zA-Z]/g
  const numberRegex = /[0-9]/g
  const emailRegex = /[a-zA-Z@.]/g
  const spaceRegex = /[ ]/g
  const validGrade = ["ADMIN", "USER"]
  if(localStorage.getItem("users")){
    var users = JSON.parse(localStorage.getItem("users"))
    users.forEach(user => {
      if(user.email===email)throw(new Error("Votre email n'est pas unique."))
    });
  }
  if(!nom.match(letteRegex))throw(new Error("Votre nom ne dois contenir que des lettres"))
  if(nom.length<1)throw(new Error("Votre nom est trop cour"))
  if(!prenom.match(letteRegex))throw(new Error("Votre prénon ne dois contenir que des lettres"))
  if(prenom.length<1)throw(new Error("Votre prenom est trop cour"))
  if(!email.match(emailRegex))throw(new Error("Email invalide"))
  if(email.length<1)throw(new Error("Votre email est trop cours"))
  if(password.length < 3)throw(new Error("votre mot de passe dois faire au minimum 3 caractéres"))
  if(age <20 )throw(new Error("vous devez être agé d'au moins 20 ans"))
  if(age > 120)throw(new Error("Votre age semble incorecte"))
  if(!age.match(numberRegex))throw(new Error("Votre age dois être composer uniquement de nombre"))
  if(!validGrade.includes(grade.toUpperCase()))throw(new Error("Votre grade n'est pas correct"))
  if(adresse.length < 20)throw(new Error("adresse trop courte"))
  if(!adresse.match(spaceRegex))throw(new Error("votre adresse dois comporter un espace"))
  if(tel.length !== 10)throw(new Error("votre numéro de tel dois être composer de 10 chiffres"))
  if(!tel.match(numberRegex))throw(new Error("votre numéro de tel ne dois comporter que des chiffres"))
  return true
}
function handleRegister(nom, prenom, email, password, age, grade, adresse, tel){
  try{
  var isValid = validateUser(nom, prenom, email, password, age, grade, adresse, tel)
  }catch(err){
    showError(err)
  }
  if(isValid){
    console.log("valide")
    if(localStorage.getItem("users")){
      var users = JSON.parse(localStorage.getItem("users"))
    }else{
      var users = [];
    }
    const user = {
      id: users?users.length+1:1,
      nom: nom,
      prenom: prenom,
      email: email,
      password: password,
      age: age,
      grade: grade,
      adresse: adresse,
      tel: tel
    }
    users.push(user)
    localStorage.setItem("users", JSON.stringify(users))
  }
}
function appendRegister(){
  clearError()
  let registerForm = document.createElement("form")
  let nomLabel = document.createElement("label")
  let nomInput = document.createElement("input")
  let prenomLabel = document.createElement("label")
  let prenomInput = document.createElement("input")
  let emailLabel = document.createElement("label")
  let emailInput = document.createElement("input")
  let passwordLabel = document.createElement("label")
  let passwordInput = document.createElement("input")
  let ageLabel = document.createElement("label")
  let ageInput = document.createElement("input")
  let gradeLabel = document.createElement("label")
  let gradeInput = document.createElement("input")
  let adresseLabel = document.createElement("label")
  let adresseInput = document.createElement("input")
  let telephoneLabel = document.createElement("label")
  let telephoneInput = document.createElement("input")
  let submitButton = document.createElement("button")
  let br = document.createElement('br')
  nomLabel.innerText = "Nom : "
  nomInput.type = "text"
  prenomLabel.innerText = "Prénom : "
  prenomInput.type = "text"
  emailLabel.innerText = "Email : "
  emailInput.type = "email"
  passwordLabel.innerText = "Mot de passe : "
  passwordInput.type = "password"
  ageLabel.innerText = "Age : "
  ageInput.type = "number"
  gradeLabel.innerText = "Grade : "
  gradeInput.type = "text"
  adresseLabel.innerText = "Adresse : "
  adresseInput.type = "text"
  telephoneLabel.innerText ="Téléphone : "
  telephoneInput.type = "text"
  submitButton.type = "submit"
  submitButton.innerText = "Valider"
  registerForm.addEventListener("submit", e=>{
    e.preventDefault()
    handleRegister(nomInput.value, prenomInput.value, emailInput.value, passwordInput.value, ageInput.value, gradeInput.value, adresseInput.value, telephoneInput.value)
  })
  registerForm.append(
    nomLabel,
    nomInput,
    br.cloneNode(true),
    prenomLabel,
    prenomInput,
    br.cloneNode(true),
    emailLabel,
    emailInput,
    br.cloneNode(true),
    passwordLabel,
    passwordInput,
    br.cloneNode(true),
    ageLabel,
    ageInput,
    br.cloneNode(true),
    gradeLabel,
    gradeInput,
    br.cloneNode(true),
    adresseLabel,
    adresseInput,
    br.cloneNode(true),
    telephoneLabel,
    telephoneInput,
    br.cloneNode(true),
    submitButton
    )
  main.append(registerForm)
}
function appendConnectForm(){
  clearError()
  if(main.childNodes.length){
    main.removeChild(main.childNodes[0])
  }
  let authForm = document.createElement("form")
  let emailLabel = document.createElement("label")
  let emailInput = document.createElement("input")
  let passwordLabel = document.createElement("label")
  let passwordInput = document.createElement("input")
  let submitButton = document.createElement("button")
  let createAccontButton = document.createElement("button")
  emailLabel.innerText = "email : "
  emailInput.type = "text"
  passwordLabel.innerText = "Mot de passe"
  passwordInput.type = "password"
  submitButton.type = "submit"
  submitButton.innerText = "Se connecter"
  authForm.addEventListener("submit", e=>{
    e.preventDefault()
    handleConnectionForm(emailInput.value , passwordInput.value)
  })
  createAccontButton.type = "button"
  createAccontButton.innerText = "Créer un compte"
  createAccontButton.addEventListener("click", e=>{
    main.removeChild(authForm)
    appendRegister()
  })
  if(main.childNodes.length < 2){ // on évite d'afficher 20 fois le formulaire ... 
    authForm.append(emailLabel, emailInput, passwordLabel, passwordInput, submitButton,createAccontButton)
    main.append(authForm)
  }
}
function appendNavLogout(){
  if(localStorage.getItem("curUserId")){
    const users = JSON.parse(localStorage.getItem("users"))
    users.forEach(user=>{
      if(user.id === parseInt(localStorage.getItem("curUserId"))){
        if(user.grade.toUpperCase() ==="ADMIN"){
          let client = document.createElement("button")
          client.innerText = "Clients"
          client.addEventListener("click", renderClient)
          navList.append(client)
        }
      }
    })
  }
  let disconectList = document.createElement("li")
  let disconectButton = document.createElement("button")
  disconectButton.innerText = "Se déconecter" 
  disconectButton.addEventListener("click", disconect)
  disconectList.append(disconectButton)
  disconectList.id= "disconect"
  navList.append(disconectList)
}
function appendNavLogin(){
  let conectList = document.createElement("li")
  let connectButton = document.createElement("button")
  connectButton.innerText = "S'authentifier"
  connectButton.addEventListener("click",appendConnectForm)
  conectList.append(connectButton)
  conectList.id="auth"
  navList.append(conectList)
}
if(localStorage.getItem("isAuth") === "true"){
  appendNavLogout()
  renderDashboard()
}
if(localStorage.getItem("isAuth") === "false"){
  appendNavLogin()
}