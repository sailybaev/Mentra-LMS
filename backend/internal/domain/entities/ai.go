package entities

type Flashcard struct {
	Term       string
	Definition string
}

type AssignmentFeedback struct {
	Strengths    []string
	Gaps         []string
	Improvements []string
	Overall      string
}
