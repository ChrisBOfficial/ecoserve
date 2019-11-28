## Invasive-Species Internal API doc
### Endpoints
* `/api/surveys`
	* Expects `x-api-token` as header
	* Requests
		* GET
			* Blank request GETs all surveys
			* Optional parameter `?surveyId=` GETs a specific survey associated with the provided surveyId
		* POST
			* Expects `json` payload
				* Requires `SurveyName`, `Language`, and `ProjectCategory` values
			* Expects `content-type` and `Accept` headers set to `application/json`