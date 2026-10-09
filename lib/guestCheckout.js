/** Silent account so a cash-on-delivery order can be stored. The shopper never signs in. */
export function guestCheckoutEmail(phone) {
    return `cod.${phone}@guest.theluxejewels.in`;
}

export async function guestCheckoutUserId(supabase, phone) {
    const email = guestCheckoutEmail(phone);
    const { data: existing, error: lookupError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

    if (lookupError) throw lookupError;
    if (existing?.id) return existing.id;

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { guest_checkout: true },
    });

    if (data?.user?.id) return data.user.id;

    const found = await findAuthUserId(supabase, email);
    if (found) return found;

    throw error || new Error("Could not start guest checkout");
}

async function findAuthUserId(supabase, email) {
    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (error) return null;
    return data?.users?.find((user) => user.email === email)?.id || null;
}
