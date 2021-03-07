export const pl = {
  title: "System Rezerwacji",

  buttons: {
    close: "Zamknij",
    login: "Zaloguj się",
    create: "Dodaj",
    save: "Zapisz",
    edit: "Edytuj",
    delete: "Usuń",
    confirm: "Potwierdź",
    download: "Pobierz"
  },

  $vuetify: {
    noDataText: "Brak danych",
    dataTable: {
      itemsPerPageText: "Wiersze na stronę:"
    },
    dataFooter: {
      itemsPerPageAll: "Wszystkie",
      pageText: "{0}-{1} z {2}"
    }
  },

  editDialog: {
    title: {
      create: "Stwórz {0}",
      edit: "Edytuj {0}"
    }
  },

  deleteDialog: {
    title: "Usuń {0}",
    text: "Czy na pewno chcesz usunąć ten zasób?"
  },

  navigationDrawer: {
    categories: "Kategorie",
    users: "Użytkownicy",
    login: "Logowanie",
    logout: "Wyloguj się"
  },

  login: {
    admin: {
      title: "Administrator",
      login: "Nazwa użytkownika",
      password: "Hasło"
    },

    masterAdmin: {
      title: "Główny Administrator",
      key: "Klucz"
    }
  },

  userList: {
    title: "Użytkonicy",
    type: "Użytkownik",
    fields: {
      id: "Id",
      login: "Nazwa użytkownika",
      password: "Hasło",
      externalId: "Imię nazwisko",
      adminUser: "Administator"
    }
  },

  categoryList: {
    title: "Kategorie",
    type: "Kategoria",
    fields: {
      id: "Id",
      name: "Nazwa",
      description: "Opis",
      imageBase64: "Obraz",
      inputAttributes: "Właściwości"
    }
  },

  categoryDetails: {
    properties: {
      title: "Właściwości",
      attributes: "Atrybuty",
      attribute: "Atrybut",
      fields: {
        id: "Id",
        name: "Nazwa"
      }
    },
    items: {
      title: "Zasoby",
      item: "Zasób",
      fields: {
        id: "Id",
        name: "Nazwa",
        description: "Opis",
        imageBase64: "Obraz",
        bookingAuthorizationRequired: "Wymagana autoryzacja rezerwacji",
        responsibleUsers: "Opiekunowie"
      }
    },
    calendar: {
      title: "Kalendarz",
      booking: "Rezerwacja",
      filter: {
        date: "Data rozpoczęcia",
        items: "Przedmiot",
        days: "Dni"
      },
      fields: {
        id: "Id",
        name: "Nazwa",
        user: "Właściciel",

        startDate: "Data rozpoczęcia",
        endDate: "Data zakończenia",
        startTime: "Czas rozpoczęcia",
        endTime: "Czas zakończenia",
        creationTime: "Czas utworzenia",

        repeatInterval: "Rezrwacja cykliczna",
        repeatIntervalUnit: "Cykliczność",
        repeatEndTime: "Czas zakończenie rezerwacji cyklicznej",

        confirmed: "Potwierdzone"
      },
      repeatIntervalUnit: {
        d: "Dzień",
        w: "Tydzień",
        m: "Miesiąc"
      },
      error: {
        bookingInPast: "Nie można stworzyć rezerwacji w przeszłości.",
        endTimeGreaterThanStartTime:
          "Czas zakończenia rezerwacji musi być późniejszy niż czas rozpoczęcia."
      }
    }
  },

  itemDetails: {
    properties: {
      title: "Właściwości",
      images: "Zdjęcia",
      image: "Zdjęcie",
      actions: {
        delete: "Usuń zdjęcie",
        moveUp: "Przesuń w górę",
        moveDown: "Przesuń w dół"
      }
    },
    qrCode: {
      title: "Kod QR"
    }
  },

  http: {
    missingFields: "Wystąpił błąd techniczny: brakuje niektórych pól.",
    invalidData: "Wystąpił błąd techniczny: nieprawidłowe dane żądania.",

    entityAlreadyExists: "Jednostka o podanym kluczu już istnieje.",
    entityNotExists: "Wystąpił błąd: jednostka nie istnieje.",

    incorrectLogin: "Nieprawidłowe dane logowania.",
    notLogged: "Niezalogowany.",
    missingPermissions:
      "Uprawnienia konta nie są wystarczające do wykonania tej czynności.",
    masterAdminNotAllowed:
      "Administrator główny nie może wykonać tej czynności. Zaloguj się do konta administratora.",

    bookingExistingInSameInterval:
      "W podanym przedziale czasowym istnieje już inna rezerwacja.",

    unknownError: "Wystąpił nieznany błąd."
  }
};
