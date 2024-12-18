package handlers

import (
	"net/http"

	"github.com/adfer-dev/analock-api/services"
	"github.com/adfer-dev/analock-api/utils"
	"github.com/gorilla/mux"
)

func InitDiaryEntryRoutes(router *mux.Router) {
	router.HandleFunc("/api/v1/diaryEntries", utils.ParseToHandlerFunc(handleCreateDiaryEntry)).Methods("POST")
}

/*
func handleGetUserEntries(res http.ResponseWriter, req *http.Request) error {

}*/

func handleCreateDiaryEntry(res http.ResponseWriter, req *http.Request) error {
	entryBody := services.DiaryEntryBody{}

	validationErrs := utils.HandleValidation(req, &entryBody)

	if len(validationErrs) > 0 {
		return utils.WriteJSON(res, 400, validationErrs)
	}

	savedEntry, saveEntryErr := services.SaveDiaryEntry(&entryBody)

	if saveEntryErr != nil {
		return utils.WriteJSON(res, 500, saveEntryErr.Error())
	}

	return utils.WriteJSON(res, 201, savedEntry)
}
