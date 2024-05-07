/**
 * @jest-environment jsdom
 */

import {screen, waitFor, fireEvent} from "@testing-library/dom"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills.js";
import { ROUTES_PATH, ROUTES} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
jest.mock("../app/store", () => mockStore)
import router from "../app/Router.js";
import BillsUI from "../views/BillsUI.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then the window icon should be highlighted in a vertical layout", async () => {
      // On mocke le localStorage pour contrôler le comportement du stockage local dans le test.
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      // On définit l'élément "user" dans le localStorage pour simuler la présence d'un utilisateur dans l'application.
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      // Crée un nouvel élément div qui servira de racine pour l'application.
      const root = document.createElement("div")
      // Définit l'attribut "id" sur le nouveau div pour le trouver plus facilement dans le DOM.
      root.setAttribute("id", "root")
      // Ajoute le nouveau div dans le corps du document pour simuler la présence de l'élément racine dans le DOM.
      document.body.append(root)
      // Appelle la fonction router() qui initialise les routes de l'application.
      router()
      // Simule la navigation vers la route des notes de frais dans l'application.
      window.onNavigate(ROUTES_PATH.Bills)
      // Attend que l'icône de fenêtre apparaisse dans le DOM.
      await waitFor(() => screen.getByTestId('icon-window'))
      // Récupère l'icône de fenêtre dans le DOM.
      const windowIcon = screen.getByTestId('icon-window')
      // Vérifie si l'icône de fenêtre est présente dans le DOM.
      expect(windowIcon).toBeTruthy()
    })

test("Then the bills are ordered from earliest to latest", () => {

  // Trie les notes de frais de la plus récente  à la plus ancienne.
  const billsSorted = [...bills].sort((a, b) => {
    return new Date(a.date) < new Date(b.date) ? 1 : -1;
  });

  // Mocke le magasin de données pour retourner les notes de frais.
 // Crée un faux magasin de données pour simuler la récupération des notes de frais.
const storeMock = {
  bills: () => { // Fonction qui simule la méthode de récupération des notes de frais dans le magasin.
    return {
      list: () => { // Fonction qui simule la méthode de listage des notes de frais.
        return {
          then: (fn) => fn(bills), // Méthode "then" simulée qui exécute la fonction de rappel avec les notes de frais.
        };
        },
      };
    },
  };

  // Crée un objet Bills avec le magasin de données simulé.
// Crée un objet Bills en utilisant le magasin simulé pour les notes de frais.
const billsObject = new Bills({
  document, // L'objet document est passé en tant que paramètre, ce qui peut être utilisé dans la classe Bills.
  onNavigate: {}, // Un objet vide est passé en tant que paramètre, probablement utilisé pour la navigation.
  store: storeMock, // Le magasin simulé est passé en tant que paramètre, utilisé pour récupérer les notes de frais.
  localStorage: {}, // Un objet vide est passé en tant que paramètre, probablement pour simuler le stockage local.
});


  // Récupère les notes de frais triées à partir de l'objet Bills.
  const testBillsSorted = billsObject.getBills();

  // Vérifie si les identifiants des notes de frais triées correspondent aux identifiants des notes de frais originales.
  
  expect(testBillsSorted.map((bill) => bill.id)).toEqual(
    billsSorted.map((bill) => bill.id)
  );
});


    test('Then that user is redirected to the newBill page when they click the newBill button', () => {
    // Définit le mock pour localStorage afin de simuler le stockage local.
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  // Stocke le type d'utilisateur dans localStorage.
  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee'
  }));

  // Définit la fonction onNavigate qui simule la navigation vers une page spécifique.
  const onNavigate = (pathname) => {
    // Remplace le contenu du corps du document avec le contenu de la page correspondant à la pathname spécifiée.
    document.body.innerHTML = ROUTES({ pathname });
  };

  // Affiche l'interface utilisateur la note de frais.
  document.body.innerHTML = BillsUI({bills});

  // Crée un objet Bills avec les paramètres nécessaires.
  const billsObjet = new Bills({ document, onNavigate, store : {}, localStorage : localStorageMock});
  // Crée un mock de la fonction handleClickNewBill.
  const handleClick = jest.fn(billsObjet.handleClickNewBill);
  // Récupère le bouton "Nouvelle note de frais" et ajoute un écouteur d'événements pour le clic.
  const buttonNewBill = screen.getByTestId('btn-new-bill');
  buttonNewBill.addEventListener('click', handleClick);
  // Simule un clic sur le bouton "Nouvelle note de frais".
  fireEvent.click(buttonNewBill);
  // Vérifie que la fonction handleClickNewBill a été appelée.
  expect(handleClick).toHaveBeenCalled();
});

    test("Then the call to handleClickIconEye works correctly", () => {
      // Crée un mock de la fonction.
  const myMock = jest.fn();
  // Simule la méthode modal de jQuery.
  global.$.fn.modal = () => true;
  // Simule la méthode find de jQuery.
  global.$.fn.find = () => {
    return {
      html: myMock
    }
  };

  // Crée un mock du magasin de données pour les notes de frais.
  const storeMock = {
    bills: () => {
      return {
        list: () => {
          return {
            then: (fn) => fn(bills),
          };
        },
      };
    },
  };

  // Crée un objet Bills avec les paramètres nécessaires.
  const billsObject = new Bills({
    document,
    onNavigate: {},
    store: storeMock,
    localStorage: {},
  });

  // Appelle la fonction handleClickIconEye et passe un faux élément avec une méthode getAttribute.
  billsObject.handleClickIconEye({getAttribute: () => 'lsfjklqjfhqkfh'});
  // Vérifie que le mock a été appelé avec les bons arguments.
  const myTest = myMock.mock.calls[0][0].includes('lsfjklqjfhqkfh');
  expect(myTest).toEqual(true);
});

    describe("When an error occurs", () => {
      beforeEach(() => {
        // Espionne l'appel à la fonction bills du mockStore.
        jest.spyOn(mockStore, "bills");
        // Définit localStorage avec un mock pour simuler le stockage local.
        Object.defineProperty(
            window,
            'localStorage',
            { value: localStorageMock }
        );
        // Stocke le type d'utilisateur dans localStorage.
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }));
        // Crée un élément racine et l'ajoute au corps du document.
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        router();
      });

    test(" Then it fetches bill  and fails with a 404 error message.", async () => {

       // Implémente la fonction list du mockStore qui retourne une promesse rejetée avec une erreur 404.
    mockStore.bills.mockImplementationOnce(() => {
      return {
        list : () =>  {
          return Promise.reject(new Error("Erreur 404"))
        }
      };
    });
    // Déclenche la navigation vers la page des notes de frais.
    window.onNavigate(ROUTES_PATH.Bills);
    // Attend que les tâches asynchrones soient terminées.
    await new Promise(process.nextTick);
    // Récupère le message d'erreur 404.
    const message = await screen.getByText(/Erreur 404/);
    // Vérifie que le message est présent.
    expect(message).toBeTruthy();
  });


    test("Then it fetches bills and fails with a 500 error message", async () => {

    // Implémente la fonction list du mockStore qui retourne une promesse rejetée avec une erreur 500.
    mockStore.bills.mockImplementationOnce(() => {
      return {
        list : () =>  {
          return Promise.reject(new Error("Erreur 500"))
        }
      };
    });
    // Déclenche la navigation vers la page des notes de frais.
    window.onNavigate(ROUTES_PATH.Bills);
    // Attend que les tâches asynchrones soient terminées.
    await new Promise(process.nextTick);
    // Récupère le message d'erreur 500.
    const message = await screen.getByText(/Erreur 500/);
    // Vérifie que le message est présent.
    expect(message).toBeTruthy();
  })
  })
  })
})