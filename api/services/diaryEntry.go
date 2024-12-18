package services

import (
	"github.com/adfer-dev/analock-api/models"
	"github.com/adfer-dev/analock-api/storage"
)

var diaryEntryStorage storage.Storage = &storage.DiaryEntryStorage{}

type DiaryEntryBody struct {
	Content   string `json:"content" validate:"required"`
	UserRefer uint   `json:"user_id" validate:"required"`
}

func GetDiaryEntryById(id uint) (*models.DiaryEntry, error) {
	diaryEntry, err := diaryEntryStorage.Get(id)

	if err != nil {
		return nil, err
	}

	return diaryEntry.(*models.DiaryEntry), nil
}

func SaveDiaryEntry(diaryEntryBody *DiaryEntryBody) (*models.DiaryEntry, error) {
	dbEntry := &models.DiaryEntry{
		Content:   diaryEntryBody.Content,
		UserRefer: diaryEntryBody.UserRefer,
	}
	err := diaryEntryStorage.Create(dbEntry)

	if err != nil {
		return nil, err
	}

	return dbEntry, nil
}

func UpdateDiaryEntry(diaryEntryBody *models.DiaryEntry) (*models.DiaryEntry, error) {
	err := diaryEntryStorage.Update(diaryEntryBody)

	if err != nil {
		return nil, err
	}

	return diaryEntryBody, nil
}

func DeleteDiaryEntry(id uint) error {
	return diaryEntryStorage.Delete(id)
}
