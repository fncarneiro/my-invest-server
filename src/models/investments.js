import connection from '../database/connection.js';
import * as formatResponse from '../utils/formatResponse.js';
import {
    investmentAlreadyExist,
    investmentCreated,
    investmentDeleted,
    investmentNotFound,
    investmentUpdated,
    userNotFound,
} from '../utils/messages.js';

export async function createInvestment(investment, res) {
    try {
        const userFounded = await connection.users.findFirst({ where: { id_user: investment.id_user } });
        if (!userFounded) {
            return res.status(404).json({ msg: userNotFound, id_user: investment.id_user })
        } else {
            const investmentFounded = await connection.investments.findFirst({
                where: { id_user: investment.id_user, period: investment.period }
            });

            if (investmentFounded) {
                return res.status(409).json({ msg: investmentAlreadyExist, id_user: investment.id_user, period: investment.period });
            } else {
                const resultInsert = await connection.investments.create({
                    data: {
                        period: investment.period,
                        id_user: investment.id_user,
                    }
                })
                const investmentResponse = { ...resultInsert };
                const request = { type: 'POST', description: 'Insert a investment.' };
                const response = formatResponse.investment(investmentResponse, request, investmentCreated);

                return res.status(201).json(response);
            }
        }
    } catch (error) {
        return res.status(400).json(error)
    }
};

export async function updateInvestment(investment, res) {
    try {
        const investmentFounded = await connection.investments.findUnique({ where: { id_investment: investment.id_investment } });

        if (!investmentFounded) {
            return res.status(409).json({ msg: investmentNotFound, id_investment: investment.id_investment })
        } else {
            const resultUpdate = await connection.investments.update({
                where: { id_investment: investment.id_investment },
                data: {
                    period: investment.period
                }
            });
            const investmentResponse = { ...resultUpdate };
            const request = { type: 'PUT', description: 'Update a investment.' };
            const response = formatResponse.investment(investmentResponse, request, investmentUpdated);

            res.status(202).json(response);
        }
    } catch (error) {
        return res.status(400).json(error)
    }
};

export async function listInvestment(res) {
    try {
        const resultList = await connection.investments.findMany({ orderBy: [{ id_user: 'asc' }, { period: 'asc' }] });

        const request = { type: 'GET', description: 'List all investments.' };
        const response = {
            records: resultList.length,
            investments: resultList.map(investment => {
                return formatResponse.investment(investment, request);
            })
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json(error)
    }
};

export async function getInvestment(id, res) {
    try {
        const investmentFounded = await connection.investments.findUnique({ where: { id_investment: id } });

        if (!investmentFounded) {
            return res.status(404).json({ msg: 'Id not found.', id_investment: id })
        } else {
            const investmentResponse = { ...investmentFounded };
            const request = { type: 'GET', description: 'GET a specific investment.' };
            const response = formatResponse.investment(investmentResponse, request);

            return res.status(200).json(response);
        }
    }
    catch (error) {
        return res.status(400).json(error)
    }
};

export async function deleteInvestment(investment, res) {
    try {
        const investmentFounded = await connection.investments.findUnique({ where: { id_investment: investment.id_investment } });

        if (!investmentFounded) {
            res.status(404).json({ msg: investmentNotFound, id_investment: investment.id_investment })
        } else {
            const resultDelete = await connection.investments.delete({ where: { id_investment: investment.id_investment } });

            const request = { type: 'DELETE', description: 'Delete a specific investment.' };
            const response = formatResponse.investment(resultDelete, request, investmentDeleted);

            return res.status(202).json(response);
        }
    } catch (error) {
        return res.status(400).json(error)
    }
};