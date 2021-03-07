export const en = {
  title: "Resource Booking",

  buttons: {
    close: "Close",
    login: "Login",
    create: "Create",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    confirm: "Confirm",
    download: "Download"
  },

  $vuetify: {
    noDataText: "No data available",
    dataTable: {
      itemsPerPageText: "Rows per page:"
    },
    dataFooter: {
      itemsPerPageAll: "All",
      pageText: "{0}-{1} of {2}"
    }
  },

  editDialog: {
    title: {
      create: "Create {0}",
      edit: "Edit {0}"
    }
  },

  deleteDialog: {
    title: "Delete {0}",
    text: "Are you sure you want to delete this resource?"
  },

  navigationDrawer: {
    categories: "Categories",
    users: "Users",
    login: "Login",
    logout: "Logout"
  },

  login: {
    admin: {
      title: "Admin",
      login: "Login",
      password: "Password"
    },

    masterAdmin: {
      title: "Master Admin",
      key: "Master Key"
    }
  },

  userList: {
    title: "Users",
    type: "User",
    fields: {
      id: "Id",
      login: "Login",
      password: "Password",
      externalId: "External Id",
      adminUser: "Admin User"
    }
  },

  categoryList: {
    title: "Categories",
    type: "Category",
    fields: {
      id: "Id",
      name: "Name",
      description: "Description",
      imageBase64: "Image",
      inputAttributes: "Attributes"
    }
  },

  categoryDetails: {
    properties: {
      title: "Properties",
      attributes: "Attributes",
      attribute: "Attribute",
      fields: {
        id: "Id",
        name: "Name"
      }
    },
    items: {
      title: "Items",
      item: "Item",
      fields: {
        id: "Id",
        name: "Name",
        description: "Description",
        imageBase64: "Image",
        bookingAuthorizationRequired: "Booking Authorization Required",
        responsibleUsers: "Responsible Users"
      }
    },
    calendar: {
      title: "Calendar",
      booking: "Booking",
      filter: {
        date: "Start Date",
        items: "Items",
        days: "Days"
      },
      fields: {
        id: "Id",
        name: "Name",
        user: "Owner",

        startDate: "Start date",
        endDate: "End date",
        startTime: "Start Time",
        endTime: "End Time",
        creationTime: "Creation Time",

        repeatInterval: "Repeat Interval",
        repeatIntervalUnit: "Repeat Interval Unit",
        repeatEndTime: "Repeat End Time",

        confirmed: "Confirmed"
      },
      repeatIntervalUnit: {
        d: "Day",
        w: "Week",
        m: "Month"
      },
      error: {
        bookingInPast: "Booking cannot be created in the past.",
        endTimeGreaterThanStartTime:
          "Booking end time must be greater than the start time."
      }
    }
  },

  itemDetails: {
    properties: {
      title: "Properties",
      images: "Images",
      image: "Image",
      actions: {
        delete: "Delete Image",
        moveUp: "Move Up",
        moveDown: "Move Down"
      }
    },
    qrCode: {
      title: "QR Code"
    }
  },

  http: {
    missingFields: "Technical error occurred: some fields are missing.",
    invalidData: "Technical error occurred: invalid request data.",

    entityAlreadyExists: "Entity with given key already exists.",
    entityNotExists: "Error occurred: entity not exists.",

    incorrectLogin: "Incorrect login data.",
    notLogged: "Not logged.",
    missingPermissions:
      "Account permissions are not sufficient to perform this action.",
    masterAdminNotAllowed:
      "Master admin is not allowed for this action. Please login to admin account.",

    bookingExistingInSameInterval:
      "Another booking already exists in given time interval.",

    unknownError: "Unknown error occurred."
  }
};
