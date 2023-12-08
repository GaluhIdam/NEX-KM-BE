import {
    interest,
    permissionMaster,
    role,
    rolePermission,
    skill,
    users,
} from './homepage-seeder';
import { PrismaClient as HomePagePrisma } from '@prisma/clients/homepage';
import { PrismaClient as NexLibraryPrisma } from '@prisma/clients/nex-library';
import { PrismaClient as NexCommunityPrisma } from '@prisma/clients/nex-community';
import { PermissionMasterNameOnlyDTO } from 'src/modules/homepage/roles/dtos/role-permission.dto';
import { SuperAdmin } from './meta-data';
import { unitDinas } from './nex-library-seeder';
import { roleCommunity } from './community-seeder';

const homepagePrisma = new HomePagePrisma();
const nexLibraryPrisma = new NexLibraryPrisma();
const nexCommunity = new NexCommunityPrisma();

// Function to clear existing data
async function clearData() {
    //homepage
    await homepagePrisma.userList.deleteMany({});
    await homepagePrisma.interest.deleteMany({});
    await homepagePrisma.skill.deleteMany({});
    await homepagePrisma.roles.deleteMany({});
    await homepagePrisma.masterPermission.deleteMany({});
    await homepagePrisma.userRole.deleteMany({});
    await homepagePrisma.rolePermission.deleteMany({});

    //nex-library
    await nexLibraryPrisma.unitDinas.deleteMany({});
}
// Running Seeder
async function main() {
    let homepageTransaction;
    let nexLibraryTransaction;
    let nexCommunityTransaction;
    try {
        // Clear existing data
        await clearData();
        // Start a homepage prisma transaction
        homepageTransaction = await homepagePrisma.$transaction([
            // Seeding Users
            ...users.map((data) => homepagePrisma.userList.create({ data })),

            // Seeding Interests
            ...interest.map((data) => homepagePrisma.interest.create({ data })),

            // Seeding Skills
            ...skill.map((data) => homepagePrisma.skill.create({ data })),

            // Seeding Roles
            ...role.map((data) => homepagePrisma.roles.create({ data })),

            // Seeding Master Permission
            ...permissionMaster.map((data) =>
                homepagePrisma.masterPermission.create({
                    data: {
                        name: data.name
                            .split('-')
                            .map((word) => word.toUpperCase())
                            .join('_'),
                        description: data.description.toUpperCase(),
                    },
                }),
            ),
        ]);

        // Start a nex library prisma transaction
        nexLibraryTransaction = await nexLibraryPrisma.$transaction([
            // Seeding Unit Dinas
            ...unitDinas.map((data) =>
                nexLibraryPrisma.unitDinas.create({ data }),
            ),
        ]);

        nexCommunityTransaction = await nexCommunity.$transaction([
            ...roleCommunity.map((data) =>
                nexCommunity.communityRoles.create({ data }),
            ),
        ]);

        // Seeding Admin
        await seedingAdmin(role[0].name);

        // Seeding User
        await seedingUser(role[1].name, rolePermission);

        //Assign Role
        role.forEach(async (data) => {
            await assignRole(SuperAdmin.personalNumber, data.name);
        });

        console.log('Seeding Completed');
    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        if (homepageTransaction) {
            await homepagePrisma.$queryRaw`COMMIT;`;
        }

        if (nexLibraryTransaction) {
            await nexLibraryPrisma.$queryRaw`COMMIT;`;
        }

        await homepagePrisma.$disconnect();
        await nexLibraryPrisma.$disconnect();
    }
}

// Seeding Permission Admin
async function seedingAdmin(roles: string) {
    try {
        const dataPermission = await homepagePrisma.masterPermission.findMany();
        const dataRole = await homepagePrisma.roles.findFirst({
            where: {
                name: roles,
            },
        });
        const rolePermissionsToCreate = dataPermission.map((data) => ({
            roleId: dataRole.id,
            masterPermissionId: data.id,
        }));

        await homepagePrisma.rolePermission.createMany({
            data: rolePermissionsToCreate,
        });

        console.log('Seeding Super Administrator Completed');
    } catch (error) {
        throw error;
    }
}

// Seeding Permission User
async function seedingUser(
    roles: string,
    permission: PermissionMasterNameOnlyDTO[],
) {
    try {
        const dataRole = await homepagePrisma.roles.findFirst({
            where: {
                name: roles,
            },
        });
        permission.forEach(async (data) => {
            const perm = await homepagePrisma.masterPermission.findFirst({
                where: {
                    name: data.name,
                },
            });
            await homepagePrisma.rolePermission.create({
                data: {
                    roleId: dataRole.id,
                    masterPermissionId: perm.id,
                },
            });
        });

        console.log('Seeding User Completed');
    } catch (error) {
        throw error;
    }
}

// Assign Role
async function assignRole(personalNumber: string, roles: string) {
    try {
        const admin = await homepagePrisma.userList.findFirst({
            where: {
                personalNumber: personalNumber,
            },
        });
        const role = await homepagePrisma.roles.findFirst({
            where: {
                name: roles,
            },
        });
        await homepagePrisma.userRole.create({
            data: {
                roleId: role.id,
                userId: admin.id,
            },
        });
    } catch (error) {
        throw error;
    }
}

main().catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
});
