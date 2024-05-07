import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({ document, localStorage, onNavigate })
  }
  handleChangeFile = e => {
    e.preventDefault()
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    const filePath = e.target.value.split(/\\/g)
    const fileName = filePath[filePath.length-1]
    const formData = new FormData()
    const email = JSON.parse(localStorage.getItem("user")).email
    //Ajouter noveau const
  
// Définit un tableau contenant les types d'images acceptés.
const ImgTypes = ["image/jpg", "image/jpeg", "image/png"];
// Ajoute les données 'file' et 'email' à l'objet formData.
formData.append('file', file);
formData.append('email', email);

// Vérifie si le type de fichier est inclus dans les types d'images acceptés.
if (ImgTypes.includes(file.type)) {
// Si le type de fichier est valide, envoie une requête pour créer une nouvelle facture avec les données formData.
this.store
.bills()
.create({
data: formData,
headers: { noContentType: true }
})
.then(({ fileUrl, key }) => {
// En cas de succès, enregistre l'URL du fichier, définit les propriétés billId, fileUrl et fileName.
console.log(fileUrl);
this.billId = key;
this.fileUrl = fileUrl;
this.fileName = fileName;
})
.catch(error => console.error(error));
} else {
// Si le type de fichier n'est pas autorisé, affiche une alerte et réinitialise la valeur de l'entrée du fichier      alert("Le format du fichier doit être en .JPG, .JPEG ou .PNG")
      e.target.value = "";
    }
  };
  handleSubmit = e => {
    e.preventDefault()
    console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
    const email = JSON.parse(localStorage.getItem("user")).email
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    this.updateBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
      .bills()
      .update({data: JSON.stringify(bill), selector: this.billId})
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => console.error(error))
    }
  }
}