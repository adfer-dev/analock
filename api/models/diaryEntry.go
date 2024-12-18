package models

type DiaryEntry struct {
	Id        uint   `json:"id"`
	Content   string `json:"content"`
	UserRefer uint   `json:"user_id"`
}
