/**
 * @jest-environment jsdom
 */

// Import des fonctions et des composants nécessaires pour les tests
import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import mockStore from "../__mocks__/store";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import userEvent from "@testing-library/user-event";
import router from "../app/Router.js";

// Simulation du magasin
jest.mock("../app/store", () => mockStore);

// Description des tests
describe("Given I am connected as an employee", () => {
  describe("When I submit a new Bill", () => {
   test("Then the bill should be successfully saved", async () => {
     
     // Espionnage de la méthode mockStore.bills
      jest.spyOn(mockStore, "bills");

      // Simulation de la navigation
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      // Mise en place des informations utilisateur dans localStorage
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      // Rendu de l'interface utilisateur pour une nouvelle note de frais
      const html = NewBillUI();
      document.body.innerHTML = html;

      // Initialisation du conteneur NewBill
      const newBillInit = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      // Création d'un objet fichier et assignation à l'élément input
      const file = new File(["image"], "image.png", { type: "image/png" });
      const billFile = screen.getByTestId("file");

      // Mise en place de la fonction de gestion du changement de fichier
      const handleChangeFile = jest.fn((e) => newBillInit.handleChangeFile(e));
      billFile.addEventListener("change", handleChangeFile);

      // Téléchargement simulé du fichier
      userEvent.upload(billFile, file);

      // Vérification que le nom du fichier est défini
      expect(billFile.files[0].name).toBeDefined();
      expect(handleChangeFile).toHaveBeenCalled();

      // Obtention du formulaire de nouvelle facture
      const formNewBill = screen.getByTestId("form-new-bill");
      expect(formNewBill).toBeTruthy();

      // Mise en place de la fonction de soumission du formulaire
      const handleSubmit = jest.fn((e) => newBillInit.handleSubmit(e));
      formNewBill.addEventListener("submit", handleSubmit);

      // Simulation de la soumission du formulaire
      fireEvent.submit(formNewBill);
      expect(handleSubmit).toHaveBeenCalled();
    });

    test("Then display the new bill page", async () => {
      // Mise en place des informations utilisateur dans localStorage
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));

      // Création d'un élément racine pour le rendu
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);

      // Configuration du routage
      router();

      // Déclenchement de la navigation vers la nouvelle page de note de frais
      window.onNavigate(ROUTES_PATH.NewBill);
    });

    // TEST d`integration
    test("Send the new bill to the server using the  POST method", async () => {
        // Configuration des informations utilisateur dans localStorage
        localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      
        // Création de l'élément racine pour le rendu
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
      
        // Configuration du routeur
        router();
      
        // Déclenchement de la navigation vers la page de nouvelle note de frais
        window.onNavigate(ROUTES_PATH.NewBill);
      
        // Simulation de la soumission du formulaire
        // Vous pouvez simuler l'envoi d'une nouvelle facture au serveur et vérifier la réponse ici
      });
      
  });
});