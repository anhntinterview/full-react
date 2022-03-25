import faker from 'faker';
import dayjs from 'dayjs';

export const generateData = () => {
    faker.setLocale('vi');
    let count = 20;
    const data = [];
    while (count > 0) {
        const id = faker.hacker.noun();
        const name = `${faker.name.firstName()} ${faker.name.middleName()} ${faker.name.lastName()}`;
        const parent_name = `Parent ${faker.name.firstName()}`;
        const status = 'In Progress';
        const center = faker.company.companyName();
        const created = dayjs(faker.date.soon()).format('DD-MM-YYYY');
        data.push({ id, name, parent_name, status, center, created });
        count = count - 1;
    }
    console.log(data);
    return data;
};
