import { NextFunction, Request } from 'express'
import { ValidationError, body, validationResult } from 'express-validator'
import HttpException from '../exceptions/httpException'

const handleErrorTypes = (error: ValidationError) => {
    switch(error.type) {
        case "field":
            return {
                field: error.path,
                message: error.msg
            }
        case "unknown_fields": 
            return {
            unknowfields: error.fields,
            message: error.msg
        }
        case "alternative":
            return {}
        case "alternative_grouped":
            return {}
    }
}

export const ValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if(errors.isEmpty()) {
        next()
    }

    const extractedErrors = errors.array({onlyFirstError: true}).map(handleErrorTypes)
    
    next(new HttpException(401, "Validation error", extractedErrors))
}