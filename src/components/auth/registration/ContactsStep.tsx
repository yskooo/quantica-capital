
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Plus, Save, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ContactRole } from "@/types/models";
import { Badge } from "@/components/ui/badge";

const contactSchema = z.object({
  C_Name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  C_Address: z.string().min(5, { message: "Please enter the full address." }),
  C_Postal_Code: z.string().min(3, { message: "Please enter a valid postal code." }),
  C_Email: z.string().email({ message: "Please enter a valid email address." }),
  C_Contact_Number: z.string().min(10, { message: "Please enter a valid phone number." }),
  role: z.enum(['Kin', 'Referee 1', 'Referee 2']),
  relationship: z.enum(['Father', 'Mother', 'Spouse', 'Son', 'Daughter', 'Friend', 'Colleague', 'Mentor', 'Others']),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactsStepProps {
  onNext: (contacts: ContactRole[]) => void;
  onBack: () => void;
  defaultValues?: ContactRole[];
}

export function ContactsStep({ onNext, onBack, defaultValues = [] }: ContactsStepProps) {
  const [contacts, setContacts] = useState<ContactRole[]>(defaultValues);
  const [editingContact, setEditingContact] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(defaultValues.length === 0);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      C_Name: "",
      C_Address: "",
      C_Postal_Code: "",
      C_Email: "",
      C_Contact_Number: "",
      role: "Kin", // Default role
      relationship: "Friend", // Default relationship
    },
  });

  const editContact = (index: number) => {
    const contact = contacts[index];
    form.reset({
      C_Name: contact.contactDetails.C_Name,
      C_Address: contact.contactDetails.C_Address,
      C_Postal_Code: contact.contactDetails.C_Postal_Code,
      C_Email: contact.contactDetails.C_Email,
      C_Contact_Number: contact.contactDetails.C_Contact_Number,
      role: contact.role,
      relationship: contact.relationship,
    });
    setEditingContact(index);
    setShowForm(true);
  };

  const deleteContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
    // If we were editing this contact, reset the form
    if (editingContact === index) {
      form.reset();
      setEditingContact(null);
    }
  };

  function onSubmit(data: ContactFormValues) {
    const newContact: ContactRole = {
      role: data.role,
      relationship: data.relationship,
      contactDetails: {
        C_Name: data.C_Name,
        C_Address: data.C_Address,
        C_Postal_Code: data.C_Postal_Code,
        C_Email: data.C_Email,
        C_Contact_Number: data.C_Contact_Number,
      }
    };

    if (editingContact !== null) {
      // Update existing contact
      const updatedContacts = [...contacts];
      updatedContacts[editingContact] = newContact;
      setContacts(updatedContacts);
      setEditingContact(null);
    } else {
      // Add new contact
      setContacts([...contacts, newContact]);
    }

    // Reset form and hide it
    form.reset();
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      {/* Contact List */}
      {contacts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Added Contacts</h3>
          <div className="grid grid-cols-1 gap-4">
            {contacts.map((contact, index) => (
              <Card key={index} className="bg-card/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{contact.contactDetails.C_Name}</CardTitle>
                    <Badge variant="outline" className="font-medium">
                      {contact.role}
                    </Badge>
                  </div>
                  <CardDescription>
                    {contact.relationship} • {contact.contactDetails.C_Email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground pb-2">
                  <p>{contact.contactDetails.C_Address}</p>
                  <p>{contact.contactDetails.C_Contact_Number}</p>
                </CardContent>
                <CardFooter className="pt-0 flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => editContact(index)}
                  >
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                      >
                        Remove
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Contact</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove {contact.contactDetails.C_Name} from your contacts? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteContact(index)}>
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Add/Edit Contact Form */}
      {showForm ? (
        <Card className="backdrop-blur-sm border">
          <CardHeader>
            <CardTitle>{editingContact !== null ? "Edit Contact" : "Add Contact"}</CardTitle>
            <CardDescription>
              {editingContact !== null 
                ? "Update the information for this contact." 
                : "Add an emergency contact or referee for your account."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Kin">Kin (Emergency Contact)</SelectItem>
                            <SelectItem value="Referee 1">Referee 1</SelectItem>
                            <SelectItem value="Referee 2">Referee 2</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Father">Father</SelectItem>
                            <SelectItem value="Mother">Mother</SelectItem>
                            <SelectItem value="Spouse">Spouse</SelectItem>
                            <SelectItem value="Son">Son</SelectItem>
                            <SelectItem value="Daughter">Daughter</SelectItem>
                            <SelectItem value="Friend">Friend</SelectItem>
                            <SelectItem value="Colleague">Colleague</SelectItem>
                            <SelectItem value="Mentor">Mentor</SelectItem>
                            <SelectItem value="Others">Others</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="C_Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="C_Email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="C_Contact_Number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+1 (555) 000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="C_Address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="C_Postal_Code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      form.reset();
                      setEditingContact(null);
                      setShowForm(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {editingContact !== null ? "Update Contact" : "Save Contact"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Button 
          onClick={() => setShowForm(true)} 
          variant="outline" 
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add a Contact
        </Button>
      )}
      
      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 mt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        
        <Button 
          onClick={() => onNext(contacts)} 
          disabled={contacts.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
