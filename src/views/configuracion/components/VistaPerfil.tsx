import { useMemo } from 'react'
import Button from '@/components/ui/Button'
import Upload from '@/components/ui/Upload'
import Input from '@/components/ui/Input'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import { Form, FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { countryList } from '@/constants/countries.constant'
import { components } from 'react-select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { HiOutlineUser } from 'react-icons/hi'
import { TbPlus } from 'react-icons/tb'
import { useSessionUser } from '@/store/authStore'
import type { ControlProps, OptionProps } from 'react-select'
import type { ZodType } from 'zod'
import type { EsquemaPerfil, OpcionPais } from '../types'

const esquemaValidacion: ZodType<EsquemaPerfil> = z.object({
    nombre:       z.string().min(1, { message: 'El nombre es requerido' }),
    apellido:     z.string().min(1, { message: 'El apellido es requerido' }),
    email:        z.string().min(1, { message: 'El email es requerido' }).email({ message: 'Email inválido' }),
    codigoArea:   z.string().min(1, { message: 'Selecciona tu código de área' }),
    telefono:     z.string().min(1, { message: 'Ingresa tu número de teléfono' }),
    pais:         z.string().min(1, { message: 'Selecciona un país' }),
    direccion:    z.string().min(1, { message: 'La dirección es requerida' }),
    codigoPostal: z.string().min(1, { message: 'El código postal es requerido' }),
    ciudad:       z.string().min(1, { message: 'La ciudad es requerida' }),
    img:          z.string(),
})

const { Control } = components

const OpcionSelectCustom = (props: OptionProps<OpcionPais> & { variante: 'pais' | 'telefono' }) => (
    <DefaultOption<OpcionPais>
        {...props}
        customLabel={(data, label) => (
            <span className="flex items-center gap-2">
                <Avatar shape="circle" size={20} src={`/img/countries/${data.value}.png`} />
                {props.variante === 'pais'     && <span>{label}</span>}
                {props.variante === 'telefono' && <span>{data.dialCode}</span>}
            </span>
        )}
    />
)

const ControlCustom = ({ children, ...props }: ControlProps<OpcionPais>) => {
    const seleccionado = props.getValue()[0]
    return (
        <Control {...props}>
            {seleccionado && <Avatar className="ltr:ml-4 rtl:mr-4" shape="circle" size={20} src={`/img/countries/${seleccionado.value}.png`} />}
            {children}
        </Control>
    )
}

const VistaPerfil = () => {
    const usuario = useSessionUser((state) => state.user)

    const listaCodigosArea = useMemo(() => {
        const lista: Array<OpcionPais> = JSON.parse(JSON.stringify(countryList))
        return lista.map((c) => ({ ...c, label: c.dialCode }))
    }, [])

    const { handleSubmit, formState: { errors, isSubmitting }, control } = useForm<EsquemaPerfil>({
        resolver: zodResolver(esquemaValidacion),
        defaultValues: {
            nombre:       usuario?.userName?.split(' ')[0] ?? '',
            apellido:     usuario?.userName?.split(' ')[1] ?? '',
            email:        usuario?.email ?? '',
            img:          usuario?.avatar ?? '',
            codigoArea:   '',
            telefono:     '',
            pais:         '',
            direccion:    '',
            codigoPostal: '',
            ciudad:       '',
        },
    })

    const alEnviar = async (valores: EsquemaPerfil) => { console.log(valores) }

    return (
        <>
            <h4 className="mb-8">Información personal</h4>
            <Form onSubmit={handleSubmit(alEnviar)}>
                <div className="mb-8">
                    <Controller name="img" control={control} render={({ field }) => (
                        <div className="flex items-center gap-4">
                            <Avatar size={90} className="border-4 border-white bg-gray-100 text-gray-300 shadow-lg" icon={<HiOutlineUser />} src={field.value} />
                            <div className="flex items-center gap-2">
                                <Upload showList={false} uploadLimit={1}
                                    beforeUpload={(files) => {
                                        if (!files) return true
                                        for (const file of files)
                                            if (!['image/jpeg', 'image/png'].includes(file.type))
                                                return '¡Solo se permiten archivos .jpeg o .png!'
                                        return true
                                    }}
                                    onChange={(files) => { if (files.length > 0) field.onChange(URL.createObjectURL(files[0])) }}
                                >
                                    <Button variant="solid" size="sm" type="button" icon={<TbPlus />}>Subir imagen</Button>
                                </Upload>
                                <Button size="sm" type="button" onClick={() => field.onChange('')}>Eliminar</Button>
                            </div>
                        </div>
                    )} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <FormItem label="Nombre" invalid={Boolean(errors.nombre)} errorMessage={errors.nombre?.message}>
                        <Controller name="nombre" control={control} render={({ field }) => <Input type="text" autoComplete="off" placeholder="Nombre" {...field} />} />
                    </FormItem>
                    <FormItem label="Apellido" invalid={Boolean(errors.apellido)} errorMessage={errors.apellido?.message}>
                        <Controller name="apellido" control={control} render={({ field }) => <Input type="text" autoComplete="off" placeholder="Apellido" {...field} />} />
                    </FormItem>
                </div>
                <FormItem label="Correo electrónico" invalid={Boolean(errors.email)} errorMessage={errors.email?.message}>
                    <Controller name="email" control={control} render={({ field }) => <Input type="email" autoComplete="off" placeholder="Correo electrónico" {...field} />} />
                </FormItem>
                <div className="flex items-end gap-4 w-full mb-6">
                    <FormItem invalid={Boolean(errors.telefono) || Boolean(errors.codigoArea)}>
                        <label className="form-label mb-2">Número de teléfono</label>
                        <Controller name="codigoArea" control={control} render={({ field }) => (
                            <Select<OpcionPais> options={listaCodigosArea} {...field} className="w-[150px]"
                                components={{ Option: (props) => <OpcionSelectCustom variante="telefono" {...(props as OptionProps<OpcionPais>)} />, Control: ControlCustom }}
                                placeholder=""
                                value={listaCodigosArea.filter((o) => o.dialCode === field.value)}
                                onChange={(option) => field.onChange(option?.dialCode)}
                            />
                        )} />
                    </FormItem>
                    <FormItem className="w-full" invalid={Boolean(errors.telefono)} errorMessage={errors.telefono?.message}>
                        <Controller name="telefono" control={control} render={({ field }) => (
                            <NumericInput autoComplete="off" placeholder="Teléfono" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                        )} />
                    </FormItem>
                </div>
                <h4 className="mb-6">Información de dirección</h4>
                <FormItem label="País" invalid={Boolean(errors.pais)} errorMessage={errors.pais?.message}>
                    <Controller name="pais" control={control} render={({ field }) => (
                        <Select<OpcionPais> options={countryList} {...field}
                            components={{ Option: (props) => <OpcionSelectCustom variante="pais" {...(props as OptionProps<OpcionPais>)} />, Control: ControlCustom }}
                            placeholder=""
                            value={countryList.filter((o) => o.value === field.value)}
                            onChange={(option) => field.onChange(option?.value)}
                        />
                    )} />
                </FormItem>
                <FormItem label="Dirección" invalid={Boolean(errors.direccion)} errorMessage={errors.direccion?.message}>
                    <Controller name="direccion" control={control} render={({ field }) => <Input type="text" autoComplete="off" placeholder="Dirección" {...field} />} />
                </FormItem>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem label="Ciudad" invalid={Boolean(errors.ciudad)} errorMessage={errors.ciudad?.message}>
                        <Controller name="ciudad" control={control} render={({ field }) => <Input type="text" autoComplete="off" placeholder="Ciudad" {...field} />} />
                    </FormItem>
                    <FormItem label="Código postal" invalid={Boolean(errors.codigoPostal)} errorMessage={errors.codigoPostal?.message}>
                        <Controller name="codigoPostal" control={control} render={({ field }) => <Input type="text" autoComplete="off" placeholder="Código postal" {...field} />} />
                    </FormItem>
                </div>
                <div className="flex justify-end">
                    <Button variant="solid" type="submit" loading={isSubmitting}>Guardar</Button>
                </div>
            </Form>
        </>
    )
}

export default VistaPerfil