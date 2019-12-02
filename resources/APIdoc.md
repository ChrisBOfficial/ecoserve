## Invasive-Species Internal API doc
### Endpoints
* `/api/surveys`
	* Expects `x-api-token` as header
	* GET
		* Blank request GETs all surveys
		* Optional parameter `?surveyId=` GETs a specific survey associated with the provided surveyId
* `/api/projects`
	* GET
        * Expects `accept` header set to `application/json`
        * Response returns `projects.json`
	* POST
		* Expects `json` payload with following values:
			* `name`
			* `data`
				* `description`
				* `surveyID`
				* `blocks`
					* First Block
						* Options
					* Second Block
						* Options
					* etc
		* Expects `content-type` and `accept` headers set to `application/json`
		* Response returns updated `projects.json`
	* DELETE
		* Expects `json` payload with following values:
			* `name`
		* Expects `content-type` and `accept` headers set to `application/json`
		* Response returns updated `projects.json`
