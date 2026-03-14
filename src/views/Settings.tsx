import { Suspense, useMemo, useState } from 'react'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import useResponsive from '@/utils/hooks/useResponsive'
import { create } from 'zustand'
import ThemeConfigurator from '@/components/template/ThemeConfigurator'
import { TbPalette, TbUser, TbPlus, TbCreditCard } from 'react-icons/tb'
import { HiOutlineUser } from 'react-icons/hi'
import Button from '@/components/ui/Button'
import Upload from '@/components/ui/Upload'
import Input from '@/components/ui/Input'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import { Form, FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { countryList } from '@/constants/countries.constant'
import { components } from 'react-select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { useSessionUser } from '@/store/authStore'
import classNames from '@/utils/classNames'
import isLastChild from '@/utils/isLastChild'
import dayjs from 'dayjs'
import { PiLightningFill } from 'react-icons/pi'
import { NumericFormat } from 'react-number-format'
import type { ControlProps, OptionProps } from 'react-select'
import type { ZodType } from 'zod'

// ─── Types ───────────────────────────────────────────────────────────────────

type View = 'profile' | 'billing' | 'theme'

type SettingsStore = {
    currentView: View
    setCurrentView: (view: View) => void
}

type ProfileSchema = {
    firstName: string
    lastName: string
    email: string
    dialCode: string
    phoneNumber: string
    img: string
    country: string
    address: string
    postcode: string
    city: string
}

type CountryOption = {
    label: string
    dialCode: string
    value: string
}

type CreditCard = {
    cardId: string
    cardType: 'VISA' | 'MASTER'
    cardHolderName: string
    last4Number: string
    expMonth: string
    expYear: string
    primary: boolean
}

type Transaction = {
    id: string
    date: number
    amount: number
    status: string
    description: string
}

type BillingData = {
    currentPlan: {
        plan: string
        status: string
        billingCycle: string
        nextPaymentDate: number | null
        amount: number | null
    }
    paymentMethods: CreditCard[]
    transactionHistory: Transaction[]
}

// ─── Store ───────────────────────────────────────────────────────────────────

const useSettingsStore = create<SettingsStore>((set) => ({
    currentView: 'profile',
    setCurrentView: (view) => set({ currentView: view }),
}))

// ─── Menu ────────────────────────────────────────────────────────────────────

const menuItems = [
    { key: 'profile', label: 'Profile', icon: <TbUser size={18} /> },
    { key: 'billing', label: 'Billing', icon: <TbCreditCard size={18} /> },
    { key: 'theme',   label: 'Theme',   icon: <TbPalette size={18} /> },
] as const

// ─── Validation ──────────────────────────────────────────────────────────────

const validationSchema: ZodType<ProfileSchema> = z.object({
    firstName:   z.string().min(1, { message: 'First name required' }),
    lastName:    z.string().min(1, { message: 'Last name required' }),
    email:       z.string().min(1, { message: 'Email required' }).email({ message: 'Invalid email' }),
    dialCode:    z.string().min(1, { message: 'Please select your country code' }),
    phoneNumber: z.string().min(1, { message: 'Please input your mobile number' }),
    country:     z.string().min(1, { message: 'Please select a country' }),
    address:     z.string().min(1, { message: 'Address required' }),
    postcode:    z.string().min(1, { message: 'Postcode required' }),
    city:        z.string().min(1, { message: 'City required' }),
    img:         z.string(),
})

// ─── Select subcomponents ────────────────────────────────────────────────────

const { Control } = components

const CustomSelectOption = (
    props: OptionProps<CountryOption> & { variant: 'country' | 'phone' },
) => (
    <DefaultOption<CountryOption>
        {...props}
        customLabel={(data, label) => (
            <span className="flex items-center gap-2">
                <Avatar shape="circle" size={20} src={`/img/countries/${data.value}.png`} />
                {props.variant === 'country' && <span>{label}</span>}
                {props.variant === 'phone'   && <span>{data.dialCode}</span>}
            </span>
        )}
    />
)

const CustomControl = ({ children, ...props }: ControlProps<CountryOption>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <Avatar
                    className="ltr:ml-4 rtl:mr-4"
                    shape="circle"
                    size={20}
                    src={`/img/countries/${selected.value}.png`}
                />
            )}
            {children}
        </Control>
    )
}

// Configuracion del perfil

const ProfileView = () => {
    const user = useSessionUser((state) => state.user)

    const dialCodeList = useMemo(() => {
        const list: Array<CountryOption> = JSON.parse(JSON.stringify(countryList))
        return list.map((c) => ({ ...c, label: c.dialCode }))
    }, [])

    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
    } = useForm<ProfileSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            firstName:   user?.userName?.split(' ')[0] ?? '',
            lastName:    user?.userName?.split(' ')[1] ?? '',
            email:       user?.email ?? '',
            img:         user?.avatar ?? '',
            dialCode:    '',
            phoneNumber: '',
            country:     '',
            address:     '',
            postcode:    '',
            city:        '',
        },
    })

    const onSubmit = async (values: ProfileSchema) => {
        console.log(values)
    }

    return (
        <>
            <h4 className="mb-8">Personal information</h4>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-8">
                    <Controller name="img" control={control} render={({ field }) => (
                        <div className="flex items-center gap-4">
                            <Avatar
                                size={90}
                                className="border-4 border-white bg-gray-100 text-gray-300 shadow-lg"
                                icon={<HiOutlineUser />}
                                src={field.value}
                            />
                            <div className="flex items-center gap-2">
                                <Upload
                                    showList={false}
                                    uploadLimit={1}
                                    beforeUpload={(files) => {
                                        if (!files) return true
                                        for (const file of files)
                                            if (!['image/jpeg', 'image/png'].includes(file.type))
                                                return 'Please upload a .jpeg or .png file!'
                                        return true
                                    }}
                                    onChange={(files) => {
                                        if (files.length > 0)
                                            field.onChange(URL.createObjectURL(files[0]))
                                    }}
                                >
                                    <Button variant="solid" size="sm" type="button" icon={<TbPlus />}>
                                        Upload Image
                                    </Button>
                                </Upload>
                                <Button size="sm" type="button" onClick={() => field.onChange('')}>
                                    Remove
                                </Button>
                            </div>
                        </div>
                    )} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <FormItem label="First name" invalid={Boolean(errors.firstName)} errorMessage={errors.firstName?.message}>
                        <Controller name="firstName" control={control} render={({ field }) => (
                            <Input type="text" autoComplete="off" placeholder="First Name" {...field} />
                        )} />
                    </FormItem>
                    <FormItem label="Last name" invalid={Boolean(errors.lastName)} errorMessage={errors.lastName?.message}>
                        <Controller name="lastName" control={control} render={({ field }) => (
                            <Input type="text" autoComplete="off" placeholder="Last Name" {...field} />
                        )} />
                    </FormItem>
                </div>

                <FormItem label="Email" invalid={Boolean(errors.email)} errorMessage={errors.email?.message}>
                    <Controller name="email" control={control} render={({ field }) => (
                        <Input type="email" autoComplete="off" placeholder="Email" {...field} />
                    )} />
                </FormItem>

                <div className="flex items-end gap-4 w-full mb-6">
                    <FormItem invalid={Boolean(errors.phoneNumber) || Boolean(errors.dialCode)}>
                        <label className="form-label mb-2">Phone number</label>
                        <Controller name="dialCode" control={control} render={({ field }) => (
                            <Select<CountryOption>
                                options={dialCodeList}
                                {...field}
                                className="w-[150px]"
                                components={{
                                    Option: (props) => <CustomSelectOption variant="phone" {...(props as OptionProps<CountryOption>)} />,
                                    Control: CustomControl,
                                }}
                                placeholder=""
                                value={dialCodeList.filter((o) => o.dialCode === field.value)}
                                onChange={(option) => field.onChange(option?.dialCode)}
                            />
                        )} />
                    </FormItem>
                    <FormItem className="w-full" invalid={Boolean(errors.phoneNumber)} errorMessage={errors.phoneNumber?.message}>
                        <Controller name="phoneNumber" control={control} render={({ field }) => (
                            <NumericInput autoComplete="off" placeholder="Phone Number" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                        )} />
                    </FormItem>
                </div>

                <h4 className="mb-6">Address information</h4>

                <FormItem label="Country" invalid={Boolean(errors.country)} errorMessage={errors.country?.message}>
                    <Controller name="country" control={control} render={({ field }) => (
                        <Select<CountryOption>
                            options={countryList}
                            {...field}
                            components={{
                                Option: (props) => <CustomSelectOption variant="country" {...(props as OptionProps<CountryOption>)} />,
                                Control: CustomControl,
                            }}
                            placeholder=""
                            value={countryList.filter((o) => o.value === field.value)}
                            onChange={(option) => field.onChange(option?.value)}
                        />
                    )} />
                </FormItem>

                <FormItem label="Address" invalid={Boolean(errors.address)} errorMessage={errors.address?.message}>
                    <Controller name="address" control={control} render={({ field }) => (
                        <Input type="text" autoComplete="off" placeholder="Address" {...field} />
                    )} />
                </FormItem>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem label="City" invalid={Boolean(errors.city)} errorMessage={errors.city?.message}>
                        <Controller name="city" control={control} render={({ field }) => (
                            <Input type="text" autoComplete="off" placeholder="City" {...field} />
                        )} />
                    </FormItem>
                    <FormItem label="Postal Code" invalid={Boolean(errors.postcode)} errorMessage={errors.postcode?.message}>
                        <Controller name="postcode" control={control} render={({ field }) => (
                            <Input type="text" autoComplete="off" placeholder="Postal Code" {...field} />
                        )} />
                    </FormItem>
                </div>

                <div className="flex justify-end">
                    <Button variant="solid" type="submit" loading={isSubmitting}>Save</Button>
                </div>
            </Form>
        </>
    )
}

// Cambiar suscripcion

const mockBilling: BillingData = {
    currentPlan: {
        plan: 'Modo Full',
        status: 'activo',
        billingCycle: 'mensual',
        nextPaymentDate: dayjs().add(30, 'day').unix(),
        amount: 29.99,
    },
    paymentMethods: [
        {
            cardId: '1',
            cardType: 'VISA',
            cardHolderName: 'John Doe',
            last4Number: '4242',
            expMonth: '12',
            expYear: '26',
            primary: true,
        },
    ],
    transactionHistory: [
        { id: '1', date: dayjs().subtract(1, 'month').unix(), amount: 29.99, status: 'Paid', description: 'Modo Full - Monthly' },
        { id: '2', date: dayjs().subtract(2, 'month').unix(), amount: 29.99, status: 'Paid', description: 'Modo Full - Monthly' },
        { id: '3', date: dayjs().subtract(3, 'month').unix(), amount: 29.99, status: 'Paid', description: 'Modo Full - Monthly' },
    ],
}

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const BillingView = () => {
    const data = mockBilling

    return (
        <div>
            <h4 className="mb-4">Plan Actual</h4>

            {/* Current plan */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="bg-emerald-500" shape="circle" icon={<PiLightningFill />} />
                        <div>
                            <div className="flex items-center gap-2">
                                <h6 className="font-bold">{data.currentPlan.plan}</h6>
                                <Tag className="bg-success-subtle text-success rounded-md border-0">
                                    <span className="capitalize">{data.currentPlan.status}</span>
                                </Tag>
                            </div>
                            <div className="font-semibold">
                                <span>Billing {data.currentPlan.billingCycle}</span>
                                <span> | </span>
                                <span>Siguiente pago en {dayjs.unix(data.currentPlan.nextPaymentDate ?? 0).format('MM/DD/YYYY')}</span>
                                <span className="mx-1">por</span>
                                <NumericFormat
                                    className="font-bold heading-text"
                                    displayType="text"
                                    value={(Math.round((data.currentPlan.amount ?? 0) * 100) / 100).toFixed(2)}
                                    prefix="$"
                                    thousandSeparator
                                />
                            </div>
                        </div>
                    </div>
                    <Button size="sm" variant="solid">Cambiar plan</Button>
                </div>
            </div>

            {/* Payment methods */}
            <div className="mt-8">
                <h5>Método de pago</h5>
                <div>
                    {data.paymentMethods.map((card, index) => (
                        <div
                            key={card.cardId}
                            className={classNames(
                                'flex items-center justify-between p-4',
                                !isLastChild(data.paymentMethods, index) && 'border-b border-gray-200 dark:border-gray-600',
                            )}
                        >
                            <div className="flex items-center">
                                {card.cardType === 'VISA' && <img src="/img/others/img-8.png" alt="visa" />}
                                {card.cardType === 'MASTER' && <img src="/img/others/img-9.png" alt="master" />}
                                <div className="ml-3 rtl:mr-3">
                                    <div className="flex items-center">
                                        <div className="text-gray-900 dark:text-gray-100 font-semibold">
                                            {card.cardHolderName} •••• {card.last4Number}
                                        </div>
                                        {card.primary && (
                                            <Tag className="bg-primary-subtle text-primary rounded-md border-0 mx-2">
                                                Primario
                                            </Tag>
                                        )}
                                    </div>
                                    <span>Expired {months[parseInt(card.expMonth) - 1]} 20{card.expYear}</span>
                                </div>
                            </div>
                            <Button size="sm" type="button">Edit</Button>
                        </div>
                    ))}
                    <Button variant="plain" icon={<TbPlus />}>Add payment method</Button>
                </div>
            </div>

            {/* Transaction history */}
            <div className="mt-8">
                <h5 className="mb-4">Transaction history</h5>
                <div className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold">Date</th>
                                <th className="text-left px-4 py-3 font-semibold">Description</th>
                                <th className="text-left px-4 py-3 font-semibold">Amount</th>
                                <th className="text-left px-4 py-3 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.transactionHistory.map((tx, index) => (
                                <tr
                                    key={tx.id}
                                    className={classNames(
                                        !isLastChild(data.transactionHistory, index) && 'border-b border-gray-200 dark:border-gray-600'
                                    )}
                                >
                                    <td className="px-4 py-3">{dayjs.unix(tx.date).format('MM/DD/YYYY')}</td>
                                    <td className="px-4 py-3">{tx.description}</td>
                                    <td className="px-4 py-3">
                                        <NumericFormat displayType="text" value={tx.amount.toFixed(2)} prefix="$" thousandSeparator />
                                    </td>
                                    <td className="px-4 py-3">
                                        <Tag className="bg-success-subtle text-success rounded-md border-0">{tx.status}</Tag>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

// Aqui va el main component

const Settings = () => {
    const { currentView, setCurrentView } = useSettingsStore()
    const { smaller, larger } = useResponsive()

    return (
        <AdaptiveCard className="h-full">
            <div className="flex flex-auto h-full">
                {larger.lg && (
                    <div className="w-[200px] xl:w-[280px] border-r border-gray-200 dark:border-gray-700 pr-4">
                        <h5 className="mb-6 font-semibold">Settings</h5>
                        <nav className="flex flex-col gap-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item.key}
                                    onClick={() => setCurrentView(item.key)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left
                                        ${currentView === item.key
                                            ? 'bg-primary text-white font-medium'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                )}

                {smaller.lg && (
                    <div className="mb-6 w-full">
                        <select
                            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800"
                            value={currentView}
                            onChange={(e) => setCurrentView(e.target.value as View)}
                        >
                            {menuItems.map((item) => (
                                <option key={item.key} value={item.key}>{item.label}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="ltr:xl:pl-6 rtl:xl:pr-6 flex-1 py-2">
                    <Suspense fallback={<></>}>
                        {currentView === 'profile' && <ProfileView />}
                        {currentView === 'billing' && <BillingView />}
                        {currentView === 'theme'   && (
                            <div>
                                <h4 className="mb-8">Theme</h4>
                                <ThemeConfigurator />
                            </div>
                        )}
                    </Suspense>
                </div>
            </div>
        </AdaptiveCard>
    )
}

export default Settings